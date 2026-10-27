import { forwardRef, Module } from "@nestjs/common"
import { UsuariosService } from "./usuarios.service.js"
import { UsuariosController } from "./usuarios.controller.js"
import { MongooseModule } from "@nestjs/mongoose"
import { EsquemaUsuario, Usuario } from "./usuario.schema.js"
import { AutenticacionModule } from "../autenticacion/autenticacion.module.js"

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: EsquemaUsuario }]),
    forwardRef((): typeof AutenticacionModule => AutenticacionModule)
  ],
  exports: [UsuariosService]
})
export class UsuariosModule {}