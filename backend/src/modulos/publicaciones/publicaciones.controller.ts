import {
  Body, Controller, Delete, Get,
  HttpCode, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors
} from "@nestjs/common"
import { PublicacionesService } from "./publicaciones.service.js"
import { CrearPublicacionDto } from "./dto/crear-publicacion.dto.js"
import { DocumentoPublicacion } from "./publicacion.schema.js"
import { ActualizarPublicacionDto } from "./dto/actualizar-publicacion.dto.js"
import { FileInterceptor } from "@nestjs/platform-express"
import { AutenticacionGuard } from "../../guardias/autenticacion.guard.js"
import { OpcionesDto } from "./dto/opciones.dto.js"

@Controller("publicaciones")
@UseGuards(AutenticacionGuard)
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("imagen", { dest: "./subidas/publicaciones" }))
  crear(
    @Req() peticion: any, @Body() crearPublicacionDto: CrearPublicacionDto, @UploadedFile() imagen?: Express.Multer.File
  ): Promise<DocumentoPublicacion> {
    if (imagen) crearPublicacionDto.imagen = `http://localhost:3000/subidas/publicaciones/${ imagen.filename }`

    return this.publicacionesService.crear({ ...crearPublicacionDto, autor: peticion.usuario.sujeto})
  }

  @Get()
  buscarTodos(@Query() opciones: OpcionesDto): Promise<DocumentoPublicacion[]> { return this.publicacionesService.buscarTodos(opciones) }

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
  @HttpCode(204)
  eliminar(@Req() peticion: any, @Param("id") idPublicacion: string): Promise<void> {
    return this.publicacionesService.eliminar(idPublicacion, peticion.usuario.sujeto)
  }

  @Post(":id/corazones")
  darCorazon(@Req() peticion: any, @Param("id") idPublicacion: string): Promise<void> {
    return this.publicacionesService.darCorazon(idPublicacion, peticion.usuario.sujeto)
  }

  @Delete(":id/corazones")
  @HttpCode(204)
  quitarCorazon(@Req() peticion: any, @Param("id") idPublicacion: string): Promise<void> {
    return this.publicacionesService.quitarCorazon(idPublicacion, peticion.usuario.sujeto)
  }
}