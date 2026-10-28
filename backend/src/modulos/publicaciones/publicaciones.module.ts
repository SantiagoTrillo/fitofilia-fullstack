import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { EsquemaPublicacion, Publicacion } from "./publicacion.schema.js"
import { PublicacionesService } from "./publicaciones.service.js"
import { PublicacionesController } from "./publicaciones.controller.js"
import { AutenticacionModule } from "../autenticacion/autenticacion.module.js"
import { UsuariosModule } from "../usuarios/usuarios.module.js"
import { ArchivosService } from "../../archivos.service.js"

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService, ArchivosService],
  imports: [MongooseModule.forFeature([{ name: Publicacion.name, schema: EsquemaPublicacion }]), AutenticacionModule, UsuariosModule]
})
export class PublicacionesModule {}