import { BadRequestException, Injectable } from "@nestjs/common"
import { DocumentoPublicacion, Publicacion } from "../entidad/publicacion.schema.js"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Comentario, DocumentoComentario } from "../comentarios/entidad/comentario.schema.js"
import { DocumentoUsuario, Usuario } from "../../usuarios/entidad/usuario.schema.js"

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name) private modeloPublicacion: Model<DocumentoPublicacion>,
    @InjectModel(Comentario.name) private modeloComentario: Model<DocumentoComentario>,
    @InjectModel(Usuario.name) private modeloUsuario: Model<Usuario>
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

  async contarPublicacionesUsuariosPeriodo(
    fechaDesde: string, fechaHasta: string
  ): Promise<{ nombreUsuario: string; cantidadPublicaciones: number }[]> {
    this.validarPeriodo(fechaDesde, fechaHasta)

    const usuarios: DocumentoUsuario[] = await this.modeloUsuario.find().select("nombreUsuario")
    const resultado: { nombreUsuario: string; cantidadPublicaciones: number }[] = []

    for (const usuario of usuarios) {
      const cantidadPublicaciones: number = await this.modeloPublicacion.countDocuments(
        { autor: usuario._id, createdAt: { $gte: fechaDesde, $lte: fechaHasta } }
      )

      resultado.push({ nombreUsuario: usuario.nombreUsuario, cantidadPublicaciones })
    }

    return resultado.sort(
      (primerResultado: { nombreUsuario: string; cantidadPublicaciones: number },
       segundoResultado: { nombreUsuario: string; cantidadPublicaciones: number }): number =>
        primerResultado.nombreUsuario.localeCompare(segundoResultado.nombreUsuario, "es", { sensitivity: "base" })
    )
  }

  async contarComentariosPeriodo(fechaDesde: string, fechaHasta: string): Promise<number> {
    this.validarPeriodo(fechaDesde, fechaHasta)

    return this.modeloComentario.countDocuments({ createdAt: { $gte: fechaDesde, $lte: fechaHasta } })
  }

  async contarComentariosPublicacionesPeriodo(
    fechaDesde: string, fechaHasta: string
  ): Promise<{ tituloPublicacion: string; cantidadComentarios: number }[]> {
    this.validarPeriodo(fechaDesde, fechaHasta)

    const publicaciones: DocumentoPublicacion[] = await this.modeloPublicacion.find().select("titulo")
    const resultado: { tituloPublicacion: string; cantidadComentarios: number }[] = []

    for (const publicacion of publicaciones) {
      const cantidadComentarios: number = await this.modeloComentario.countDocuments(
        { publicacion: publicacion._id, createdAt: { $gte: fechaDesde, $lte: fechaHasta } }
      )

      resultado.push({ tituloPublicacion: publicacion.titulo, cantidadComentarios })
    }

    return resultado.sort(
      (primerResultado: { tituloPublicacion: string; cantidadComentarios: number },
       segundoResultado: { tituloPublicacion: string; cantidadComentarios: number }): number  =>
        primerResultado.tituloPublicacion.localeCompare(segundoResultado.tituloPublicacion, "es", { sensitivity: "base" }))
  }
}