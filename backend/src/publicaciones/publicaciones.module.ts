import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { EsquemaPublicacion, Publicacion } from "./publicacion.schema.js"
import { PublicacionesService } from "./publicaciones.service.js"
import { PublicacionesController } from "./publicaciones.controller.js"

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  imports: [MongooseModule.forFeature([{ name: Publicacion.name, schema: EsquemaPublicacion }])]
})
export class PublicacionesModule {}