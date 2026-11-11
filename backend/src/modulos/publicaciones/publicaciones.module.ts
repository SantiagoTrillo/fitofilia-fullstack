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
import { EstadisticasController } from "./estadisticas/estadisticas.controller.js"
import { EstadisticasService } from "./estadisticas/estadisticas.service.js"
import { EsquemaUsuario, Usuario } from "../usuarios/entidad/usuario.schema.js"

@Module({
  controllers: [PublicacionesController, ComentariosController, EstadisticasController],
  providers: [PublicacionesService, ComentariosService, EstadisticasService, ArchivosService],
  imports: [
    MongooseModule.forFeature([{ name: Publicacion.name, schema: EsquemaPublicacion }]),
    MongooseModule.forFeature([{ name: Comentario.name, schema: EsquemaComentario }]),
    MongooseModule.forFeature([{ name: Usuario.name, schema: EsquemaUsuario }]), AutenticacionModule, UsuariosModule
  ]
})
export class PublicacionesModule {}