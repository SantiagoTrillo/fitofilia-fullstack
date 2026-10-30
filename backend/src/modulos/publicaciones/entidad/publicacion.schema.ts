import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose"
import { Comentario, EsquemaComentario } from "../comentarios/entidad/comentario.schema.js"

@Schema({ collection: "publicaciones", timestamps: true })
export class Publicacion {
  @Prop({ required: [true, "El título es obligatorio"], trim: true, minlength: 3, maxlength: 80 })
  titulo: string
  @Prop({ default: "" })
  imagen: string
  @Prop({ default: "", trim: true, maxlength: 1000 })
  cuerpo: string
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Usuario", required: [true, "El autor de la publicación es obligatorio"] })
  autor: Types.ObjectId
  @Prop({ default: 0 })
  corazones: number
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: "Usuario", default: [] })
  dadoresCorazones: Types.ObjectId[]
  @Prop({ type: [EsquemaComentario], default: [] })
  comentarios: Comentario[]
  @Prop({ default: false })
  modificada: boolean
  @Prop({ default: true })
  disponible: boolean
}

export type DocumentoPublicacion = HydratedDocument<Publicacion>
export const EsquemaPublicacion = SchemaFactory.createForClass(Publicacion)