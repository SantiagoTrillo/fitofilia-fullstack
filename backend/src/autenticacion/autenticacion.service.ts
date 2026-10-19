import { BadRequestException, Injectable } from '@nestjs/common'
import { IniciarSesionDto } from './dto/iniciar-sesion.dto.js'
import { DocumentoUsuario } from "../usuarios/usuario.schema.js"
import bcrypt from "bcrypt"
import { UsuariosService } from "../usuarios/usuarios.service.js"

@Injectable()
export class AutenticacionService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async iniciarSesion(iniciarSesionDto: IniciarSesionDto): Promise<DocumentoUsuario> {
    const usuarioAutenticado: DocumentoUsuario | null = await this.usuariosService.buscarPorCorreo(iniciarSesionDto.correo)

    if (!usuarioAutenticado) throw new BadRequestException("Credenciales incorrectas")

    const contraseniaCorrecta: boolean = await bcrypt.compare(iniciarSesionDto.contrasenia, usuarioAutenticado.contrasenia)

    if (!contraseniaCorrecta) throw new BadRequestException("Credenciales incorrectas")

    return usuarioAutenticado
  }
}