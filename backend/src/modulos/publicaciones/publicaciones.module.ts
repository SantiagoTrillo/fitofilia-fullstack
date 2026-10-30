import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { EsquemaPublicacion, Publicacion } from "./entidad/publicacion.schema.js"
import { PublicacionesService } from "./publicaciones.service.js"
import { PublicacionesController } from "./publicaciones.controller.js"
import { AutenticacionModule } from "../autenticacion/autenticacion.module.js"
import { UsuariosModule } from "../usuarios/usuarios.module.js"
import { ArchivosService } from "../../archivos.service.js"
import { ComentariosController } from "./comentarios/comentarios.controller.js"
import { ComentariosService } from "./comentarios/comentarios.service.js"
import { Comentario, EsquemaComentario } from "./comentarios/entidad/comentario.schema.js"

@Module({
  controllers: [PublicacionesController, ComentariosController],
  providers: [PublicacionesService, ComentariosService, ArchivosService],
  imports: [
    MongooseModule.forFeature([{ name: Publicacion.name, schema: EsquemaPublicacion }]),
    MongooseModule.forFeature([{ name: Comentario.name, schema: EsquemaComentario }]), AutenticacionModule, UsuariosModule
  ]
})
export class PublicacionesModule {}