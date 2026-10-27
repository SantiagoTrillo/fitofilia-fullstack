import { Controller, Post, Body, UseInterceptors, UploadedFile, Headers, UnauthorizedException } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import "multer"
import { AutenticacionService } from "./autenticacion.service.js"
import { IniciarSesionDto } from "./dto/iniciar-sesion.dto.js"
import { DocumentoUsuario } from "../usuarios/usuario.schema.js"
import { CrearUsuarioDto } from "../usuarios/dto/crear-usuario.dto.js"
import { UsuariosService } from "../usuarios/usuarios.service.js"

@Controller()
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService, private readonly usuarioService: UsuariosService) {}

  @Post("/inicio-sesion")
  iniciarSesion(@Body() iniciarSesionDto: IniciarSesionDto): Promise<any> {
    return this.autenticacionService.iniciarSesion(iniciarSesionDto)
  }

  @Post("/registro")
  @UseInterceptors(FileInterceptor("fotoPerfil", { dest: "./subidas/perfiles" }))
  async registrar(@Body() crearUsuarioDto: CrearUsuarioDto, @UploadedFile() archivo?: Express.Multer.File): Promise<any> {
    if (archivo) crearUsuarioDto.fotoPerfil = `http://localhost:3000/subidas/perfiles/${ archivo.filename }`

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