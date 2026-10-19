import { Controller, Post, Body, } from '@nestjs/common'
import { AutenticacionService } from './autenticacion.service.js'
import { IniciarSesionDto } from './dto/iniciar-sesion.dto.js'
import { DocumentoUsuario }  from "../usuarios/usuario.schema.js"
import { CrearUsuarioDto } from "../usuarios/dto/crear-usuario.dto.js"
import { UsuariosService } from "../usuarios/usuarios.service.js"

@Controller()
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService, private readonly usuarioService: UsuariosService) {}

  @Post("/inicio-sesion")
  iniciarSesion(@Body() iniciarSesionDto: IniciarSesionDto): Promise<DocumentoUsuario> {
    return this.autenticacionService.iniciarSesion(iniciarSesionDto)
  }

  @Post("/registro")
  registrar(@Body() crearUsuarioDto: CrearUsuarioDto): Promise<DocumentoUsuario> {
    return this.usuarioService.crear(crearUsuarioDto)
  }
}