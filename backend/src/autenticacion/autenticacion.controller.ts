import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import 'multer'
import { AutenticacionService } from './autenticacion.service.js'
import { IniciarSesionDto } from './dto/iniciar-sesion.dto.js'
import { DocumentoUsuario } from "../usuarios/usuario.schema.js"
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
  @UseInterceptors(FileInterceptor('fotoPerfil', { dest: './subidas/perfiles' }))
  registrar(@Body() crearUsuarioDto: CrearUsuarioDto, @UploadedFile() archivo?: Express.Multer.File): Promise<DocumentoUsuario> {
    if (archivo) crearUsuarioDto.fotoPerfil = `http://localhost:3000/subidas/perfiles/${archivo.filename}`
    return this.usuarioService.crear(crearUsuarioDto)
  }
}