import { BadRequestException, Injectable } from "@nestjs/common"
import { DocumentoPublicacion, Publicacion } from "../entidad/publicacion.schema.js"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Comentario, DocumentoComentario } from "../comentarios/entidad/comentario.schema.js"

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name) private modeloPublicacion: Model<DocumentoPublicacion>,
    @InjectModel(Comentario.name) private modeloComentario: Model<DocumentoComentario>
  ) {}

  private validarPeriodo(fechaDesde: string, fechaHasta: string): void {
    const inicioPeriodo: Date = new Date(fechaDesde)
    const finPeriodo: Date = new Date(fechaHasta)

    if (!fechaDesde?.trim() || Number.isNaN(inicioPeriodo.getTime())) {
      throw new BadRequestException("La fecha desde no es válida")
    }
    if (!fechaHasta?.trim() || Number.isNaN(finPeriodo.getTime())) throw new BadRequestException("La fecha hasta no es válida")
    if (inicioPeriodo > finPeriodo) throw new BadRequestException("La fecha desde no puede ser posterior a la fecha hasta")
  }

  async contarPublicacionesPeriodo(fechaDesde: string, fechaHasta: string): Promise<number> {
    this.validarPeriodo(fechaDesde, fechaHasta)

    return this.modeloPublicacion.countDocuments({ createdAt: { $gte: fechaDesde, $lte: fechaHasta } })
  }

  async contarComentariosPeriodo(fechaDesde: string, fechaHasta: string): Promise<number> {
    this.validarPeriodo(fechaDesde, fechaHasta)

    return this.modeloComentario.countDocuments({ createdAt: { $gte: fechaDesde, $lte: fechaHasta } })
  }

  async contarComentariosPublicacionPeriodo(idPublicacion: string, fechaDesde: string, fechaHasta: string): Promise<number> {
    this.validarPeriodo(fechaDesde, fechaHasta)

    return this.modeloComentario.countDocuments({ publicacion: idPublicacion, createdAt: { $gte: fechaDesde, $lte: fechaHasta } })
  }
}