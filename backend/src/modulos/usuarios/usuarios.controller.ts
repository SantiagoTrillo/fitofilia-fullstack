import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, HttpCode } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { UsuariosService } from "./usuarios.service.js"
import { CrearUsuarioDto } from "./dto/crear-usuario.dto.js"
import { ActualizarUsuarioDto } from "./dto/actualizar-usuario.dto.js"
import { DocumentoUsuario } from "./entidad/usuario.schema.js"
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
  async crear(
    @Req() peticion: any, @Body() crearUsuarioDto: CrearUsuarioDto, @UploadedFile() fotoPerfil?: Express.Multer.File
  ): Promise<DocumentoUsuario> {
    if (fotoPerfil) crearUsuarioDto.fotoPerfil = await this.archivosService.subirArchivo(fotoPerfil, "usuarios")

    return this.usuariosService.crear(peticion.usuario.sujeto, crearUsuarioDto)
  }

  @Get()
  @UseGuards(AdministradorGuard)
  buscarTodos(): Promise<DocumentoUsuario[]> { return this.usuariosService.buscarTodos() }

  @Get(":id")
  @UseGuards(AdministradorGuard)
  buscarPorId(@Param("id") idBuscado: string): Promise<DocumentoUsuario> { return this.usuariosService.buscarPorId(idBuscado) }

  @Get(":correo")
  @UseGuards(AdministradorGuard)
  buscarPorCorreo(@Param("correo") correoBuscado: string): Promise<DocumentoUsuario> {
    return this.usuariosService.buscarPorCorreo(correoBuscado)
  }

  @Get(":nombreUsuario")
  @UseGuards(AdministradorGuard)
  buscarPorNombreUsuario(@Param("nombreUsuario") nombreUsuarioBuscado: string): Promise<DocumentoUsuario> {
    return this.usuariosService.buscarPorNombreUsuario(nombreUsuarioBuscado)
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("fotoPerfil", { storage: memoryStorage() }))
  async actualizar(@Param("id") idBuscado: string, @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
    @Req() peticion: any, @UploadedFile() fotoPerfil?: Express.Multer.File
  ): Promise<DocumentoUsuario | null> {
    if (fotoPerfil) actualizarUsuarioDto.fotoPerfil = await this.archivosService.subirArchivo(fotoPerfil, "usuarios")

    return this.usuariosService.actualizar(idBuscado, peticion.usuario.sujeto, actualizarUsuarioDto)
  }

  @Delete(":id")
  @HttpCode(204)
  @UseGuards(AdministradorGuard)
  eliminar(@Req() peticion: any, @Param("id") idBuscado: string): Promise<DocumentoUsuario | null> {
    return this.usuariosService.actualizar(idBuscado, peticion.usuario.sujeto, { disponible: false })
  }

  @Post(":id")
  @HttpCode(200)
  @UseGuards(AdministradorGuard)
  habilitar(@Param("id") idBuscado: string): Promise<DocumentoUsuario | null> { return this.usuariosService.habilitar(idBuscado) }
}