import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { PublicacionesService } from "./publicaciones.service.js"
import { CrearPublicacionDto } from "./dto/crear-publicacion.dto.js"
import { DocumentoPublicacion } from "./publicacion.schema.js"
import { ActualizarPublicacionDto } from "./dto/actualizar-publicacion.dto.js"
import { FileInterceptor } from "@nestjs/platform-express"
import { AutenticacionGuard } from "../../guardias/autenticacion.guard.js"
import { PaginacionDto } from "./dto/paginacion.dto.js"

@Controller("publicaciones")
@UseGuards(AutenticacionGuard)
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
  buscarTodos(@Query() opciones: PaginacionDto): Promise<DocumentoPublicacion[]> {
    const { titulo, autor, orden, offset, limit } = opciones

    if (titulo) return this.publicacionesService.buscarPorTitulo(titulo)
    if (autor && !orden && offset === undefined && limit === undefined) return this.publicacionesService.buscarPorAutor(autor)

    return this.publicacionesService.buscarTodos({ orden, autor, offset, limit })
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