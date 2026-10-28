import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { DocumentoPublicacion, Publicacion } from "./publicacion.schema.js"
import { Model } from "mongoose"
import { CrearPublicacionDto } from "./dto/crear-publicacion.dto.js"
import { ActualizarPublicacionDto } from "./dto/actualizar-publicacion.dto.js"
import { OpcionesDto } from "./dto/opciones.dto.js"
import { DocumentoUsuario } from "../usuarios/usuario.schema.js"
import { UsuariosService } from "../usuarios/usuarios.service.js"

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private modeloPublicacion: Model<DocumentoPublicacion>,
    private readonly usuariosService: UsuariosService
  ) {}

  private escaparExpresionRegular(texto: string): string { return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }

  async crear(crearPublicacionDto: CrearPublicacionDto): Promise<DocumentoPublicacion> {
    const publicacionNueva = new this.modeloPublicacion({ ...crearPublicacionDto })

    return await publicacionNueva.save()
  }

  async buscarTodos(opciones: OpcionesDto = {}): Promise<DocumentoPublicacion[]> {
    const filtros: any = {}

    if (opciones.disponible !== undefined) filtros.disponible = opciones.disponible
    if (opciones.autor) filtros.autor = opciones.autor
    if (opciones.titulo?.trim()) filtros.titulo = new RegExp(this.escaparExpresionRegular(opciones.titulo.trim()), "i")

    let consulta = this.modeloPublicacion.find(filtros)
      .populate("autor", "nombreUsuario fotoPerfil")

    if (opciones.orden === "fecha") consulta = consulta.sort({ createdAt: -1 })
    else if (opciones.orden === "corazones") consulta = consulta.sort({ corazones: -1 })
    if (opciones.offset !== undefined) consulta = consulta.skip(opciones.offset)
    if (opciones.limit !== undefined) consulta = consulta.limit(opciones.limit)

    return await consulta
}

  async buscarPorId(idBuscado: string): Promise<DocumentoPublicacion> {
    const publicacionBuscada: DocumentoPublicacion | null = await this.modeloPublicacion.findById(idBuscado)

    if (!publicacionBuscada) throw new NotFoundException("Publicación no encontrada")

    return publicacionBuscada
  }

  async actualizar(idBuscado: string, actualizarPublicacionDto: ActualizarPublicacionDto): Promise<DocumentoPublicacion> {
    const publicacionActualizada: DocumentoPublicacion | null = await this.modeloPublicacion.findByIdAndUpdate(
      idBuscado, actualizarPublicacionDto, { returnDocument: "after" }
    )

    if (!publicacionActualizada) throw new NotFoundException("Publicación no encontrada")

    return publicacionActualizada
  }

  async eliminar(idPublicacion: string, idUsuario: string): Promise<void> {
    const publicacionEliminada: DocumentoPublicacion | null = await this.modeloPublicacion.findById(idPublicacion)

    if (!publicacionEliminada) throw new NotFoundException("Publicación no encontrada")

    const usuarioEliminador: DocumentoUsuario = await this.usuariosService.buscarPorId(idUsuario)

    if (publicacionEliminada.autor.toString() !== usuarioEliminador._id.toString() && usuarioEliminador.perfil !== "administrador") {
      throw new ForbiddenException("No tenés permiso para eliminar esta publicación")
    }

    publicacionEliminada.disponible = false

    await publicacionEliminada.save()
  }

  async darCorazon(idPublicacion: string, idUsuario: string): Promise<void> {
    const publicacionGustada: DocumentoPublicacion | null = await this.modeloPublicacion.findOne({ _id: idPublicacion, disponible: true })

    if (!publicacionGustada) throw new NotFoundException("Publicación no encontrada")

    const usuarioDador: DocumentoUsuario = await this.usuariosService.buscarPorId(idUsuario)

    if (!usuarioDador.disponible) throw new ForbiddenException("El usuario no está disponible")

    const corazonExistente: boolean = (publicacionGustada.dadoresCorazones ?? []).map(id => id.toString()).includes(idUsuario)

    if (corazonExistente) throw new ConflictException("El usuario ya dio un corazón a esta publicación")

    await this.modeloPublicacion.updateOne(
      { _id: idPublicacion, disponible: true, dadoresCorazones: { $ne: idUsuario }},
      { $addToSet: { dadoresCorazones: idUsuario }, $inc: { corazones: 1 }}
    )
  }

  async quitarCorazon(idPublicacion: string, idUsuario: string): Promise<void> {
    const publicacionDisgustada: DocumentoPublicacion | null = await this.modeloPublicacion.findOne({ _id: idPublicacion, disponible: true })

    if (!publicacionDisgustada) throw new NotFoundException("Publicación no encontrada")

    const usuarioRevocador: DocumentoUsuario = await this.usuariosService.buscarPorId(idUsuario)

    if (!usuarioRevocador.disponible) throw new ForbiddenException("El usuario no está disponible")

    const corazonExistente: boolean = (publicacionDisgustada.dadoresCorazones ?? []).map(id => id.toString()).includes(idUsuario)

    if (!corazonExistente) throw new ConflictException("El usuario no dio un corazón para quitar de esta publicación")

    await this.modeloPublicacion.updateOne(
      { _id: idPublicacion, disponible: true, dadoresCorazones: idUsuario },
      { $pull: { dadoresCorazones: idUsuario }, $inc: { corazones: -1 }}
    )
  }
}