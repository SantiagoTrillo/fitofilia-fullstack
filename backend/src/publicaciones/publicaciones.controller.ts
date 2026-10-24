import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common"
import { PublicacionesService } from "./publicaciones.service.js"
import { CrearPublicacionDto } from "./dto/crear-publicacion.dto.js"
import { DocumentoPublicacion } from "./publicacion.schema.js"
import { ActualizarPublicacionDto } from "./dto/actualizar-publicacion.dto.js"
import { FileInterceptor } from "@nestjs/platform-express"

@Controller("publicaciones")
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("imagen", { dest: "./subidas/publicaciones" }))
  crear(
    @Body() crearPublicacionDto: CrearPublicacionDto, @Body("autor") idAutor: string,
    @UploadedFile() imagen?: Express.Multer.File
  ): Promise<DocumentoPublicacion> {
    if (imagen) crearPublicacionDto.imagen = `http://localhost:3000/subidas/publicaciones/${ imagen.filename }`
    return this.publicacionesService.crear(crearPublicacionDto, idAutor)
  }

  @Get()
  buscarTodos(@Query("titulo") titulo?: string, @Query("autor") autor?: string): Promise<DocumentoPublicacion[]> {
    if (titulo) return this.publicacionesService.buscarPorTitulo(titulo)
    if (autor) return this.publicacionesService.buscarPorAutor(autor)
    return this.publicacionesService.buscarTodos()
  }

  @Get(":id")
  buscarPorId(@Param("id") idBuscado: string): Promise<DocumentoPublicacion> {
    return this.publicacionesService.buscarPorId(idBuscado)
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("imagen", { dest: "./subidas/publicaciones" }))
  actualizar(
    @Param("id") idBuscado: string, @Body() actualizarPublicacionDto: ActualizarPublicacionDto,
    @UploadedFile() imagen?: Express.Multer.File
  ): Promise<DocumentoPublicacion> {
    if (imagen) actualizarPublicacionDto.imagen = `http://localhost:3000/subidas/publicaciones/${ imagen.filename }`
    return this.publicacionesService.actualizar(idBuscado, actualizarPublicacionDto)
  }

  @Delete(":id")
  eliminar(@Param("id") idBuscado: string): Promise<DocumentoPublicacion> {
    return this.publicacionesService.actualizar(idBuscado, { disponible: false })
  }
}