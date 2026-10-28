import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, ForbiddenException, HttpCode
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { UsuariosService } from "./usuarios.service.js"
import { CrearUsuarioDto } from "./dto/crear-usuario.dto.js"
import { ActualizarUsuarioDto } from "./dto/actualizar-usuario.dto.js"
import { DocumentoUsuario } from "./usuario.schema.js"
import { AutenticacionGuard } from "../../guardias/autenticacion.guard.js"
import { AdministradorGuard } from "../../guardias/administrador.guard.js"
import { Req } from "@nestjs/common"
import { memoryStorage } from "multer"
import { ArchivosService } from "../../archivos.service.js"

@Controller("usuarios")
@UseGuards(AutenticacionGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService, private readonly archivosService: ArchivosService) {}

  @Post()
  @UseGuards(AdministradorGuard)
  @UseInterceptors(FileInterceptor("fotoPerfil", { storage: memoryStorage() }))
  async crear(@Body() crearUsuarioDto: CrearUsuarioDto, @UploadedFile() fotoPerfil?: Express.Multer.File): Promise<DocumentoUsuario> {
    if (fotoPerfil) crearUsuarioDto.fotoPerfil = await this.archivosService.subirArchivo(fotoPerfil, "usuarios")

    return this.usuariosService.crear(crearUsuarioDto)
  }

  @Get()
  @UseGuards(AdministradorGuard)
  buscarTodos(): Promise<DocumentoUsuario[]> { return this.usuariosService.buscarTodos() }

  @Get(":id")
  @UseGuards(AdministradorGuard)
  buscarPorId(@Param("id") idBuscado: string): Promise<DocumentoUsuario> { return this.usuariosService.buscarPorId(idBuscado) }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("fotoPerfil", { storage: memoryStorage() }))
  async actualizar(@Param("id") idBuscado: string, @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
    @Req() peticion: any, @UploadedFile() fotoPerfil?: Express.Multer.File
  ): Promise<DocumentoUsuario> {
    const usuarioAutenticado: any = peticion.usuario
    const mismoUsuario: boolean = String(usuarioAutenticado?.sujeto) === String(idBuscado)
    const administrador: boolean = usuarioAutenticado?.perfil === "administrador"

    if (!mismoUsuario && !administrador) { throw new ForbiddenException("No tenés permisos para editar este perfil") }
    if (fotoPerfil) actualizarUsuarioDto.fotoPerfil = await this.archivosService.subirArchivo(fotoPerfil, "usuarios")

    return this.usuariosService.actualizar(idBuscado, actualizarUsuarioDto)
  }

  @Delete(":id")
  @HttpCode(204)
  @UseGuards(AdministradorGuard)
  eliminar(@Param("id") idBuscado: string): Promise<DocumentoUsuario> {
    return this.usuariosService.actualizar(idBuscado, { disponible: false })
  }
}