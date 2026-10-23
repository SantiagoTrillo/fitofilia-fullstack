import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import "multer"
import { UsuariosService } from "./usuarios.service.js"
import { CrearUsuarioDto } from "./dto/crear-usuario.dto.js"
import { ActualizarUsuarioDto } from "./dto/actualizar-usuario.dto.js"
import { DocumentoUsuario } from "./usuario.schema.js"

@Controller("usuarios")
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  crear(@Body() crearUsuarioDto: CrearUsuarioDto): Promise<DocumentoUsuario> { return this.usuariosService.crear(crearUsuarioDto) }

  @Get()
  buscarTodos(): Promise<DocumentoUsuario[]> { return this.usuariosService.buscarTodos() }

  @Get(":id")
  buscarPorId(@Param("id") idBuscado: string): Promise<DocumentoUsuario> { return this.usuariosService.buscarPorId(idBuscado) }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("fotoPerfil", { dest: "./subidas/perfiles" }))
  actualizarPorId(
    @Param("id") idBuscado: string,
    @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
    @UploadedFile() archivo?: Express.Multer.File
  ): Promise<DocumentoUsuario> {
    if (archivo) actualizarUsuarioDto.fotoPerfil = `http://localhost:3000/subidas/perfiles/${archivo.filename}`
    return this.usuariosService.actualizar(idBuscado, actualizarUsuarioDto)
  }

  @Delete(":id")
  eliminar(@Param("id") idBuscado: string): Promise<DocumentoUsuario> {
    return this.usuariosService.actualizar(idBuscado, { disponible: false })
  }
}