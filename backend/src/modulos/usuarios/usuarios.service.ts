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

  async crear(crearUsuarioDto: CrearUsuarioDto): Promise<DocumentoUsuario> {
    const correoExistente: DocumentoUsuario | null = await this.modeloUsuario.findOne({ correo: crearUsuarioDto.correo })

    if (correoExistente) throw new ConflictException("El correo ya está en uso")

    const usuarioExistente: DocumentoUsuario | null = await this.modeloUsuario.findOne({ nombreUsuario: crearUsuarioDto.nombreUsuario })

    if (usuarioExistente) throw new ConflictException("El nombre de usuario ya está en uso")

    const contraseniaEncriptada: string = await bcrypt.hash(crearUsuarioDto.contrasenia, 10)
    const usuarioNuevo = new this.modeloUsuario({...crearUsuarioDto, contrasenia: contraseniaEncriptada})

    return await usuarioNuevo.save()
  }

  async buscarTodos(idUsuarioBuscador: string): Promise<DocumentoUsuario[]> {
    const usuarioBuscador: DocumentoUsuario = await this.buscarPorId(idUsuarioBuscador, idUsuarioBuscador)

    if (usuarioBuscador.perfil !== "administrador") {
      throw new ForbiddenException("No tenés permisos para buscar usuarios")
    }

    return await this.modeloUsuario.find()
  }

  async buscarPorId(idUsuarioBuscado: string, idUsuarioBuscador: string): Promise<DocumentoUsuario> {
    const usuarioBuscado: DocumentoUsuario | null = await this.modeloUsuario.findById(idUsuarioBuscado)
    const usuarioBuscador: DocumentoUsuario | null = await this.modeloUsuario.findById(idUsuarioBuscador)

    if (!usuarioBuscado) throw new NotFoundException("Usuario no encontrado")
    if (usuarioBuscador?.perfil !== "administrador") {
      throw new ForbiddenException("No tenés permisos para buscar usuarios")
    }

    return usuarioBuscado
  }

  async buscarPorCorreo(correoBuscado: string): Promise<DocumentoUsuario> {
    const usuarioBuscado: DocumentoUsuario | null = await this.modeloUsuario.findOne({ correo: correoBuscado })

    if (!usuarioBuscado) throw new NotFoundException("Usuario no encontrado")

    return usuarioBuscado
  }

  async actualizar(idBuscado: string, actualizarUsuarioDto: ActualizarUsuarioDto): Promise<DocumentoUsuario> {
    const usuarioActualizado: DocumentoUsuario | null = await this.modeloUsuario
      .findByIdAndUpdate(idBuscado, actualizarUsuarioDto, { returnDocument: "after" })

    if (!usuarioActualizado) throw new NotFoundException("Usuario no encontrado")

    return usuarioActualizado
  }
}