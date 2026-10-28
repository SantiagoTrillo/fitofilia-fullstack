import { Controller, Post, Body, UseInterceptors, UploadedFile, Headers, UnauthorizedException } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { AutenticacionService } from "./autenticacion.service.js"
import { IniciarSesionDto } from "./dto/iniciar-sesion.dto.js"
import { DocumentoUsuario } from "../usuarios/usuario.schema.js"
import { CrearUsuarioDto } from "../usuarios/dto/crear-usuario.dto.js"
import { UsuariosService } from "../usuarios/usuarios.service.js"
import { memoryStorage } from "multer"
import { ArchivosService } from "../../archivos.service.js"

@Controller()
export class AutenticacionController {
  constructor(
    private readonly autenticacionService: AutenticacionService, private readonly usuarioService: UsuariosService,
    private readonly archivosService: ArchivosService
  ) {}

  @Post("/inicio-sesion")
  iniciarSesion(@Body() iniciarSesionDto: IniciarSesionDto): Promise<any> {
    return this.autenticacionService.iniciarSesion(iniciarSesionDto)
  }

  @Post("/registro")
  @UseInterceptors(FileInterceptor("fotoPerfil", { storage: memoryStorage() }))
  async registrar(@Body() crearUsuarioDto: CrearUsuarioDto, @UploadedFile() fotoPerfil?: Express.Multer.File): Promise<any> {
    if (fotoPerfil) crearUsuarioDto.fotoPerfil = await this.archivosService.subirArchivo(fotoPerfil, "usuarios")

    const usuarioCreado: DocumentoUsuario = await this.usuarioService.crear(crearUsuarioDto)
    const token: string = await this.autenticacionService.generarToken(usuarioCreado)

    return { token, usuario: usuarioCreado }
  }

  @Post("/autorizar-token")
  autorizarToken(@Headers("authorization") cabeceraAutorizacion: string): Promise<DocumentoUsuario> {
    if (!cabeceraAutorizacion) throw new UnauthorizedException("Token no proporcionado")

    const token: string = cabeceraAutorizacion.replace("Bearer ", "")

    return this.autenticacionService.autorizarToken(token)
  }

  @Post("/refrescar-token")
  refrescarToken(@Headers("authorization") cabeceraAutorizacion: string): Promise<string> {
    if (!cabeceraAutorizacion) throw new UnauthorizedException("Token no proporcionado")

    const token: string = cabeceraAutorizacion.replace("Bearer ", "")

    return this.autenticacionService.refrescarToken(token)
  }
}