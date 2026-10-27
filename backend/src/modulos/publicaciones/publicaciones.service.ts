import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { DocumentoPublicacion, Publicacion } from "./publicacion.schema.js"
import { Model } from "mongoose"
import { CrearPublicacionDto } from "./dto/crear-publicacion.dto.js"
import { ActualizarPublicacionDto } from "./dto/actualizar-publicacion.dto.js"

@Injectable()
export class PublicacionesService {
  constructor(@InjectModel(Publicacion.name) private modeloPublicacion: Model<DocumentoPublicacion>) {}

  async crear(crearPublicacionDto: CrearPublicacionDto, idAutor: string): Promise<DocumentoPublicacion> {
    const publicacionNueva = new this.modeloPublicacion({ ...crearPublicacionDto, autor: idAutor })

    return await publicacionNueva.save()
  }

  async buscarTodos(opciones?: any): Promise<DocumentoPublicacion[]> {
    const filtros: any = { disponible: true }

    if (opciones?.autor) filtros.autor = opciones.autor

    let respuesta: any = this.modeloPublicacion.find(filtros).populate("autor", "nombreUsuario fotoPerfil")

    switch (opciones?.orden) {
      case "corazones":
        respuesta = respuesta.sort({ corazones: -1 })
        break
      default:
        respuesta = respuesta.sort({ createdAt: -1 })
    }

    if (typeof opciones?.offset === "number") respuesta = respuesta.skip(opciones.offset)
    if (typeof opciones?.limit === "number") respuesta = respuesta.limit(opciones.limit)

    return await respuesta
}

  async buscarPorId(idBuscado: string): Promise<DocumentoPublicacion> {
    const publicacionBuscada: DocumentoPublicacion | null = await this.modeloPublicacion.findById(idBuscado)

    if (!publicacionBuscada) throw new NotFoundException("Publicación no encontrada")

    return publicacionBuscada
  }

  async buscarPorTitulo(tituloBuscado: string): Promise<DocumentoPublicacion[]> {
    const publicacionesBuscadas: DocumentoPublicacion[] | null = await this.modeloPublicacion
      .find({ titulo: { $regex: tituloBuscado, $options: "i" } })

    if (publicacionesBuscadas.length === 0) throw new NotFoundException("Publicación no encontrada")

    return publicacionesBuscadas
  }

  async buscarPorAutor(autorBuscado: string): Promise<DocumentoPublicacion[]> {
    const publicacionesBuscadas: DocumentoPublicacion[] | null = await this.modeloPublicacion.find({ autor: autorBuscado })

    if (publicacionesBuscadas.length === 0) throw new NotFoundException("Publicación no encontrada")

    return publicacionesBuscadas
  }

  async actualizar(idBuscado: string, actualizarPublicacionDto: ActualizarPublicacionDto): Promise<DocumentoPublicacion> {
    const publicacionActualizada: DocumentoPublicacion | null = await this.modeloPublicacion.findByIdAndUpdate(
      idBuscado, actualizarPublicacionDto, { returnDocument: "after" }
    )

    if (!publicacionActualizada) throw new NotFoundException("Publicación no encontrada")

    return publicacionActualizada
  }
}