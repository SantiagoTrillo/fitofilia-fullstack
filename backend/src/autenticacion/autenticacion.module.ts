import { Module } from '@nestjs/common'
import { AutenticacionService } from './autenticacion.service.js'
import { AutenticacionController } from './autenticacion.controller.js'
import { UsuariosModule } from "../usuarios/usuarios.module.js"

@Module({
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
  imports: [UsuariosModule]
})
export class AutenticacionModule {}