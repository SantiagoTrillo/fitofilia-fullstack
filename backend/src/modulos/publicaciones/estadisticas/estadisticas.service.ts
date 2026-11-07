import { Injectable } from "@nestjs/common"
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

  async contarPublicacionesPeriodo(fechaDesde: string, fechaHasta: string): Promise<number> {
    return this.modeloPublicacion.countDocuments({ createdAt: { $gte: new Date(fechaDesde), $lte: new Date(fechaHasta) } })
  }

  async contarComentariosPeriodo(fechaDesde: string, fechaHasta: string): Promise<number> {
    return this.modeloComentario.countDocuments({ createdAt: { $gte: new Date(fechaDesde), $lte: new Date(fechaHasta) } })
  }

  async contarComentariosPublicacionPeriodo(idPublicacion: string, fechaDesde: string, fechaHasta: string): Promise<number> {
    return this.modeloComentario.find({_id: idPublicacion})
      .countDocuments({ createdAt: { $gte: new Date(fechaDesde), $lte: new Date(fechaHasta) } })
  }
}