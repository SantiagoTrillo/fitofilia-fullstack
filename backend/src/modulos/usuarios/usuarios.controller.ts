import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, ForbiddenException } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import "multer"
import { UsuariosService } from "./usuarios.service.js"
import { CrearUsuarioDto } from "./dto/crear-usuario.dto.js"
import { ActualizarUsuarioDto } from "./dto/actualizar-usuario.dto.js"
import { DocumentoUsuario } from "./usuario.schema.js"
import { AutenticacionGuard } from "../../guardias/autenticacion.guard.js"
import { AdministradorGuard } from "../../guardias/administrador.guard.js"
import { Req } from "@nestjs/common"

@Controller("usuarios")
@UseGuards(AutenticacionGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseGuards(AdministradorGuard)
  @UseInterceptors(FileInterceptor("fotoPerfil", { dest: "./subidas/perfiles" }))
  crear(@Body() crearUsuarioDto: CrearUsuarioDto, @UploadedFile() fotoPerfil?: Express.Multer.File): Promise<DocumentoUsuario> {
    if (fotoPerfil) crearUsuarioDto.fotoPerfil = `http://localhost:3000/subidas/perfiles/${ fotoPerfil.filename }`

    return this.usuariosService.crear(crearUsuarioDto)
  }

  @Get()
  @UseGuards(AdministradorGuard)
  buscarTodos(): Promise<DocumentoUsuario[]> { return this.usuariosService.buscarTodos() }

  @Get(":id")
  @UseGuards(AdministradorGuard)
  buscarPorId(@Param("id") idBuscado: string): Promise<DocumentoUsuario> { return this.usuariosService.buscarPorId(idBuscado) }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("fotoPerfil", { dest: "./subidas/perfiles" }))
  actualizar(@Param("id") idBuscado: string, @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
    @Req() peticion: any, @UploadedFile() fotoPerfil?: Express.Multer.File
  ): Promise<DocumentoUsuario> {
    const usuarioAutenticado: any = peticion.usuario
    const mismoUsuario: boolean = String(usuarioAutenticado?.sujeto) === String(idBuscado)
    const administrador: boolean = usuarioAutenticado?.rol === "administrador"

    if (!mismoUsuario && !administrador) { throw new ForbiddenException("No tenés permisos para editar este perfil") }
    if (fotoPerfil) actualizarUsuarioDto.fotoPerfil = `http://localhost:3000/subidas/perfiles/${ fotoPerfil.filename }`

    return this.usuariosService.actualizar(idBuscado, actualizarUsuarioDto)
  }

  @Delete(":id")
  @UseGuards(AdministradorGuard)
  eliminar(@Param("id") idBuscado: string): Promise<DocumentoUsuario> {
    return this.usuariosService.actualizar(idBuscado, { disponible: false })
  }
}