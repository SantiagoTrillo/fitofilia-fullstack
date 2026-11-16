import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { IniciarSesionDto } from "./dto/iniciar-sesion.dto.js"
import { DocumentoUsuario } from "../usuarios/entidad/usuario.schema.js"
import bcrypt from "bcrypt"
import { UsuariosService } from "../usuarios/usuarios.service.js"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AutenticacionService {
  constructor(private readonly usuariosService: UsuariosService, private readonly jwtService: JwtService) {}

  async generarToken(usuario: DocumentoUsuario): Promise<string> {
    const payload = {
      sujeto: usuario._id,
      correo: usuario.correo,
      nombreUsuario: usuario.nombreUsuario,
      perfil: usuario.perfil
    }

    return this.jwtService.signAsync(payload)
  }

  async iniciarSesion(iniciarSesionDto: IniciarSesionDto): Promise<any> {
    let usuarioAutenticado: DocumentoUsuario

    try { usuarioAutenticado = await this.usuariosService.buscarPorCorreo(iniciarSesionDto.correo) }
    catch (error) {
      if (error instanceof NotFoundException) throw new UnauthorizedException("Credenciales inválidas")

      throw error
    }

    if (!usuarioAutenticado.disponible) throw new ForbiddenException("Esta cuenta se encuentra deshabilitada")

    const contraseniaCorrecta: boolean = await bcrypt.compare(iniciarSesionDto.contrasenia, usuarioAutenticado.contrasenia)

    if (!contraseniaCorrecta) throw new BadRequestException("Credenciales inválidas")

    const token: string = await this.generarToken(usuarioAutenticado)

    return { token, usuario: usuarioAutenticado }
  }

  async autorizarToken(token: string): Promise<DocumentoUsuario> {
    try {
      const payload: any = await this.jwtService.verifyAsync(token)

      return await this.usuariosService.buscarPorId(payload.sujeto)
    } catch { throw new UnauthorizedException("Token inválido o vencido") }
  }

  async refrescarToken(token: string): Promise<string> {
    try {
      const payload: any = await this.jwtService.verifyAsync(token)
      const nuevoPayload = {
        sujeto: payload.sujeto,
        correo: payload.correo,
        nombreUsuario: payload.nombreUsuario,
        perfil: payload.perfil
      }

      return await this.jwtService.signAsync(nuevoPayload)
    } catch { throw new UnauthorizedException("Token inválido o vencido") }
  }
}