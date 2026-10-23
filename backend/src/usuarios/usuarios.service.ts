import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { CrearUsuarioDto } from "./dto/crear-usuario.dto.js"
import { ActualizarUsuarioDto } from "./dto/actualizar-usuario.dto.js"
import { DocumentoUsuario, Usuario } from "./usuario.schema.js"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import bcrypt from "bcrypt"

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<DocumentoUsuario>) {}

  async crear(crearUsuarioDto: CrearUsuarioDto): Promise<DocumentoUsuario> {
    const correoExistente: DocumentoUsuario | null = await this.usuarioModel.findOne({ correo: crearUsuarioDto.correo })

    if (correoExistente) throw new ConflictException("El correo ya está en uso")

    const usuarioExistente: DocumentoUsuario | null = await this.usuarioModel.findOne({ nombreUsuario: crearUsuarioDto.nombreUsuario })

    if (usuarioExistente) throw new ConflictException("El nombre de usuario ya está en uso")

    const contraseniaEncriptada: string = await bcrypt.hash(crearUsuarioDto.contrasenia, 10)
    const usuarioNuevo = new this.usuarioModel({
      ...crearUsuarioDto,
      contrasenia: contraseniaEncriptada
    })

    return await usuarioNuevo.save()
  }

  async buscarTodos(): Promise<DocumentoUsuario[]> {
    return await this.usuarioModel.find()
  }

  async buscarPorId(idBuscado: string): Promise<DocumentoUsuario> {
    const usuarioBuscado: DocumentoUsuario | null = await this.usuarioModel.findById(idBuscado)

    if (!usuarioBuscado) throw new NotFoundException("Usuario no encontrado")

    return usuarioBuscado
  }

  async buscarPorCorreo(correoBuscado: string): Promise<DocumentoUsuario> {
    const usuarioBuscado: DocumentoUsuario | null = await this.usuarioModel.findOne({ correo: correoBuscado })

    if (!usuarioBuscado) throw new NotFoundException("Usuario no encontrado")

    return usuarioBuscado
  }

  async actualizar(idBuscado: string, actualizarUsuarioDto: ActualizarUsuarioDto): Promise<DocumentoUsuario> {
    const usuarioActualizado: DocumentoUsuario | null = await this.usuarioModel.findByIdAndUpdate(
      idBuscado, actualizarUsuarioDto, { new: true }
    )

    if (!usuarioActualizado) throw new NotFoundException("Usuario no encontrado")

    return usuarioActualizado
  }
}