import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common"
import { AutenticacionGuard } from "../../../guardias/autenticacion.guard.js"
import { AdministradorGuard } from "../../../guardias/administrador.guard.js"
import { EstadisticasService } from "./estadisticas.service.js"

@Controller("estadisticas")
@UseGuards(AutenticacionGuard, AdministradorGuard)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get("publicaciones")
  async contarPublicacionesPeriodo (
    @Query("fechaDesde") fechaDesde: string, @Query("fechaHasta") fechaHasta: string
  ): Promise<number> { return this.estadisticasService.contarPublicacionesPeriodo(fechaDesde, fechaHasta) }

  @Get("comentarios")
  async contarComentariosPeriodo(
    @Query("fechaDesde") fechaDesde: string, @Query("fechaHasta") fechaHasta: string
  ): Promise<number> { return this.estadisticasService.contarComentariosPeriodo(fechaDesde, fechaHasta) }

  @Get("publicaciones/:id/comentarios")
  async contarComentariosPublicacionPeriodo(
    @Param("id") idPublicacionBuscado: string, @Query("fechaDesde") fechaDesde: string,
    @Query("fechaHasta") fechaHasta: string
  ): Promise<number> { return this.estadisticasService.contarComentariosPublicacionPeriodo(idPublicacionBuscado, fechaDesde, fechaHasta) }
}