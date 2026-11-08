import {ConflictException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common"
import { CrearUsuarioDto } from "./dto/crear-usuario.dto.js"
import { ActualizarUsuarioDto } from "./dto/actualizar-usuario.dto.js"
import { DocumentoUsuario, Usuario } from "./entidad/usuario.schema.js"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import bcrypt from "bcrypt"

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private modeloUsuario: Model<DocumentoUsuario>) {}

  async crear(idUsuarioCreador: string, crearUsuarioDto: CrearUsuarioDto): Promise<DocumentoUsuario> {
    const correoExistente: DocumentoUsuario | null = await this.modeloUsuario.findOne({ correo: crearUsuarioDto.correo })
    const usuarioExistente: DocumentoUsuario | null = await this.modeloUsuario.findOne({ nombreUsuario: crearUsuarioDto.nombreUsuario })
    const usuarioCreador: DocumentoUsuario | null = await this.buscarPorId(idUsuarioCreador)

    if (correoExistente) throw new ConflictException("El correo ya está en uso")
    if (usuarioExistente) throw new ConflictException("El nombre de usuario ya está en uso")
    if (usuarioCreador.perfil !== "administrador" && crearUsuarioDto.perfil === "administrador") {
      throw new ForbiddenException("No tenés permiso para crear este usuario")
    }

    const contraseniaEncriptada: string = await bcrypt.hash(crearUsuarioDto.contrasenia, 10)
    const usuarioNuevo = new this.modeloUsuario({...crearUsuarioDto, contrasenia: contraseniaEncriptada})

    return await usuarioNuevo.save()
  }

  async buscarTodos(): Promise<DocumentoUsuario[]> { return await this.modeloUsuario.find().sort({ nombreUsuario: 1 }) }

  async buscarPorId(idUsuarioBuscado: string): Promise<DocumentoUsuario> {
    const usuarioBuscado: DocumentoUsuario | null = await this.modeloUsuario.findById(idUsuarioBuscado)

    if (!usuarioBuscado) throw new NotFoundException("Usuario no encontrado")

    return usuarioBuscado
  }

  async buscarPorCorreo(correoBuscado: string): Promise<DocumentoUsuario> {
    const usuarioBuscado: DocumentoUsuario | null = await this.modeloUsuario.findOne({ correo: correoBuscado })

    if (!usuarioBuscado) throw new NotFoundException("Usuario no encontrado")

    return usuarioBuscado
  }

  async buscarPorNombreUsuario(nombreUsuarioBuscado: string): Promise<DocumentoUsuario> {
    const usuarioBuscado: DocumentoUsuario | null = await this.modeloUsuario.findOne({ nombreUsuario: nombreUsuarioBuscado })

    if (!usuarioBuscado) throw new NotFoundException("Usuario no encontrado")

    return usuarioBuscado
  }

  async actualizar(
    idUsuarioActualizado: string, idUsuarioActualizador: string, actualizarUsuarioDto: ActualizarUsuarioDto
  ): Promise<DocumentoUsuario | null> {
    await this.buscarPorId(idUsuarioActualizado)

    const usuarioActualizador: DocumentoUsuario = await this.buscarPorId(idUsuarioActualizador)

    if (idUsuarioActualizado.toString() !== idUsuarioActualizador.toString() && usuarioActualizador?.perfil !== "administrador") {
      throw new ForbiddenException("No tenés permiso para editar este usuario")
    }

    await this.modeloUsuario.updateOne({ _id: idUsuarioActualizado }, { $set: { ...actualizarUsuarioDto } })

    return this.modeloUsuario.findById(idUsuarioActualizado)
  }

  async habilitar(idUsuarioHabilitado: string): Promise<DocumentoUsuario | null> {
    return await this.modeloUsuario.findByIdAndUpdate(idUsuarioHabilitado, { disponible: true }, { returnDocument: "after" })
  }
}