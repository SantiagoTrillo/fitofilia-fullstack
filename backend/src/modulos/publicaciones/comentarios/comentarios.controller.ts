import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common"
import { AutenticacionGuard } from "../../../guardias/autenticacion.guard.js"
import { OpcionesDto } from "../dto/opciones.dto.js"
import { ComentariosService } from "./comentarios.service.js"
import { CrearComentarioDto } from "./dto/crear-comentario.dto.js"
import { DocumentoComentario } from "./entidad/comentario.schema.js"

@Controller("publicaciones/:idPublicacionBuscado/comentarios")
@UseGuards(AutenticacionGuard)
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  async crear(
    @Req() peticion: any, @Param("idPublicacionBuscado") idPublicacionBuscado: string, @Body() crearComentarioDto: CrearComentarioDto
  ): Promise<DocumentoComentario> { return this.comentariosService.crear(idPublicacionBuscado, crearComentarioDto, peticion.usuario.sujeto) }

  @Get()
  async buscarPorPublicacion(
    @Param("idPublicacionBuscado") idPublicacionBuscado: string, @Query() opcionesDto: OpcionesDto
  ): Promise<DocumentoComentario[]> { return this.comentariosService.buscarPorPublicacion(idPublicacionBuscado, opcionesDto) }

  @Put(":idComentarioBuscado")
  async actualizar(
    @Req() peticion: any, @Param("idPublicacionBuscado") idPublicacionBuscado: string,
    @Param("idComentarioBuscado") idComentarioBuscado: string, @Body() crearComentarioDto: CrearComentarioDto
  ): Promise<DocumentoComentario | null> {
    return this.comentariosService.actualizar(idPublicacionBuscado, idComentarioBuscado, peticion.usuario.sujeto, crearComentarioDto)
  }

  @Delete(":idComentarioBuscado")
  @HttpCode(204)
  async eliminar(
    @Req() peticion: any, @Param("idPublicacionBuscado") idPublicacionBuscado: string,
    @Param("idComentarioBuscado") idComentarioBuscado: string
  ): Promise<void> {
    return this.comentariosService.eliminar(idPublicacionBuscado, idComentarioBuscado, peticion.usuario.sujeto)
  }
}