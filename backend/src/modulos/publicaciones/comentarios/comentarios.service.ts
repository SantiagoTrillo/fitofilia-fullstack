import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { Comentario } from "./entidad/comentario.schema.js"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Query } from "mongoose"
import { UsuariosService } from "../../usuarios/usuarios.service.js"
import { OpcionesDto } from "../dto/opciones.dto.js"
import { DocumentoUsuario } from "../../usuarios/entidad/usuario.schema.js"
import { CrearComentarioDto } from "./dto/crear-comentario.dto.js"
import { DocumentoComentario } from "./entidad/comentario.schema.js"
import { PublicacionesService } from "../publicaciones.service.js"

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name) private modeloComentario: Model<DocumentoComentario>,
    private readonly publicacionesService: PublicacionesService, private readonly usuariosService: UsuariosService
  ) {}

  async crear(idPublicacionBuscado: string, crearComentarioDto: CrearComentarioDto, idAutor: string): Promise<DocumentoComentario> {
    await this.publicacionesService.buscarPorId(idPublicacionBuscado)

    const comentarioNuevo: DocumentoComentario = new this.modeloComentario(
      { ...crearComentarioDto, autor: idAutor, publicacion: idPublicacionBuscado }
    )

    return await comentarioNuevo.save()
  }

  async buscarPorPublicacion(idPublicacionBuscado: string, opcionesDto: OpcionesDto): Promise<DocumentoComentario[]> {
    const filtros: any = { publicacion: idPublicacionBuscado }

    if (opcionesDto.disponible !== undefined) filtros.disponible = opcionesDto.disponible

    let consulta: Query<any, any> = this.modeloComentario.find(filtros).populate("autor", "nombreUsuario fotoPerfil")
      .sort({ createdAt: -1 })

    if (opcionesDto.offset !== undefined) consulta = consulta.skip(opcionesDto.offset)
    if (opcionesDto.limit !== undefined) consulta = consulta.limit(opcionesDto.limit)

    return await consulta
  }

  async actualizar(
    idPublicacionBuscado: string, idComentarioBuscado: string, idUsuarioActualizador: string, crearComentarioDto: CrearComentarioDto
  ): Promise<DocumentoComentario | null> {
    await this.publicacionesService.buscarPorId(idPublicacionBuscado)

    const comentarioActualizado: DocumentoComentario | null = await this.modeloComentario
      .findOne({ _id: idComentarioBuscado, publicacion: idPublicacionBuscado })
    const usuarioActualizador: DocumentoUsuario = await this.usuariosService.buscarPorId(idUsuarioActualizador)

    if (!comentarioActualizado) throw new NotFoundException("Comentario no encontrado")
    if (comentarioActualizado.autor.toString() !== idUsuarioActualizador.toString() && usuarioActualizador.perfil !== "administrador") {
      throw new ForbiddenException("No tenés permiso para eliminar este comentario")
    }

    await this.modeloComentario.updateOne({ _id: idComentarioBuscado }, { $set: { ...crearComentarioDto, modificado: true } })

    return this.modeloComentario.findById(idComentarioBuscado).populate("autor", "nombreUsuario fotoPerfil")
  }

  async eliminar(idPublicacionBuscado: string, idComentarioBuscado: string, idUsuarioEliminador: string): Promise<void> {
    await this.publicacionesService.buscarPorId(idPublicacionBuscado)

    const publicacionEliminada: DocumentoComentario | null = await this.modeloComentario
      .findOne({ _id: idComentarioBuscado, publicacion: idPublicacionBuscado })
    const usuarioEliminador: DocumentoUsuario = await this.usuariosService.buscarPorId(idUsuarioEliminador)

    if (!publicacionEliminada) throw new NotFoundException("Comentario no encontrado")
    if (publicacionEliminada.autor.toString() !== idUsuarioEliminador.toString() && usuarioEliminador.perfil !== "administrador") {
      throw new ForbiddenException("No tenés permiso para eliminar este comentario")
    }

    publicacionEliminada.disponible = false

    await publicacionEliminada.save()
  }
}