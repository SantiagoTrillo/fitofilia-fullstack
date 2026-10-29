import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common"
import { AutenticacionGuard } from "../../guardias/autenticacion.guard.js"

@Controller("publicaciones")
@UseGuards(AutenticacionGuard)
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService)

  @Post()
  async crear(@Req() peticion: any, @Body() crearComentarioDto: CrearComentarioDto): Promise<DocumentoComentario> {
    return this.comentariosService.crear(crearComentarioDto)
  }

  @Get(":id")
  async buscarPorPublicacion(@Param("id") idPublicacionBuscado: string): Promise<DocumentoComentario[]> {
    return this.comentariosService.buscarPorPublicacion(idPublicacionBuscado)
  }

  @Put(":id")
  async actualizar(@Param("id") idBuscado: string)
}