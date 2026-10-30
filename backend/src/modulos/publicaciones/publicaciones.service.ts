import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { DocumentoPublicacion, Publicacion } from "./entidad/publicacion.schema.js"
import { Model, Query } from "mongoose"
import { CrearPublicacionDto } from "./dto/crear-publicacion.dto.js"
import { ActualizarPublicacionDto } from "./dto/actualizar-publicacion.dto.js"
import { OpcionesDto } from "./dto/opciones.dto.js"
import { DocumentoUsuario } from "../usuarios/entidad/usuario.schema.js"
import { UsuariosService } from "../usuarios/usuarios.service.js"

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private modeloPublicacion: Model<DocumentoPublicacion>,
    private readonly usuariosService: UsuariosService
  ) {}

  private escaparExpresionRegular(texto: string): string { return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }

  async crear(crearPublicacionDto: CrearPublicacionDto, idAutor: string): Promise<DocumentoPublicacion> {
    const publicacionNueva = new this.modeloPublicacion({ ...crearPublicacionDto, autor: idAutor })

    return await publicacionNueva.save()
  }

  async buscarTodos(opcionesDto: OpcionesDto): Promise<{ publicaciones: DocumentoPublicacion[]; total: number }> {
    const filtros: any = {}

    if (opcionesDto.disponible !== undefined) filtros.disponible = opcionesDto.disponible
    if (opcionesDto.autor) filtros.autor = opcionesDto.autor
    if (opcionesDto.titulo?.trim()) filtros.titulo = new RegExp(this.escaparExpresionRegular(opcionesDto.titulo.trim()), "i")

    let consulta: Query<any, any> = this.modeloPublicacion.find(filtros).populate("autor", "nombreUsuario fotoPerfil")

    if (opcionesDto.orden === "fecha") consulta = consulta.sort({ createdAt: -1 })
    else if (opcionesDto.orden === "corazones") consulta = consulta.sort({ corazones: -1 })
    if (opcionesDto.offset !== undefined) consulta = consulta.skip(opcionesDto.offset)
    if (opcionesDto.limit !== undefined) consulta = consulta.limit(opcionesDto.limit)

    return { publicaciones: await consulta, total: await this.modeloPublicacion.countDocuments(filtros) }
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

  async eliminar(idPublicacion: string, idUsuarioEliminador: string): Promise<void> {
    const publicacionEliminada: DocumentoPublicacion | null = await this.modeloPublicacion.findById(idPublicacion)

    if (!publicacionEliminada) throw new NotFoundException("Publicación no encontrada")

    const usuarioEliminador: DocumentoUsuario = await this.usuariosService.buscarPorId(idUsuarioEliminador)

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

    if (!usuarioDador.disponible) throw new ForbiddenException("Usuario no disponible")

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

    if (!usuarioRevocador.disponible) throw new ForbiddenException("Usuario no disponible")

    const corazonExistente: boolean = (publicacionDisgustada.dadoresCorazones ?? []).map(id => id.toString()).includes(idUsuario)

    if (!corazonExistente) throw new ConflictException("El usuario no dio un corazón para quitar de esta publicación")

    await this.modeloPublicacion.updateOne(
      { _id: idPublicacion, disponible: true, dadoresCorazones: idUsuario },
      { $pull: { dadoresCorazones: idUsuario }, $inc: { corazones: -1 }}
    )
  }
}