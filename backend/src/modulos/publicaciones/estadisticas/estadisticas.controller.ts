import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { AutenticacionGuard } from "../../../guardias/autenticacion.guard.js"
import { AdministradorGuard } from "../../../guardias/administrador.guard.js"
import { EstadisticasService } from "./estadisticas.service.js"

@Controller("estadisticas")
@UseGuards(AutenticacionGuard, AdministradorGuard)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get("usuarios/publicaciones")
  async contarPublicacionesUsuariosPeriodo(
    @Query("fechaDesde") fechaDesde: string, @Query("fechaHasta") fechaHasta: string
  ): Promise<{ nombreUsuario: string; cantidadPublicaciones: number }[]> {
    return this.estadisticasService.contarPublicacionesUsuariosPeriodo(fechaDesde, fechaHasta)
  }

  @Get("comentarios")
  async contarComentariosPeriodo(
    @Query("fechaDesde") fechaDesde: string, @Query("fechaHasta") fechaHasta: string
  ): Promise<number> { return this.estadisticasService.contarComentariosPeriodo(fechaDesde, fechaHasta) }

  @Get("publicaciones/comentarios")
  async contarComentariosPublicacionesPeriodo(
    @Query("fechaDesde") fechaDesde: string, @Query("fechaHasta") fechaHasta: string
  ): Promise<{ tituloPublicacion: string; cantidadComentarios: number }[]> {
    return this.estadisticasService.contarComentariosPublicacionesPeriodo(fechaDesde, fechaHasta)
  }
}