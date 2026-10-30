import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose"

@Schema({ collection: "comentarios", timestamps: true })
export class Comentario {
  @Prop({ required: [true, "El texto es obligatorio"], trim: true, minlength: 3, maxlength: 1000 })
  texto: string
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Usuario", required: [true, "El autor del comentario es obligatorio"] })
  autor: Types.ObjectId
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Publicacion", required: [true, "La publicación del comentario es obligatoria"] })
  publicacion: Types.ObjectId
  @Prop({ default: 0 })
  corazones: number
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: "Usuario", default: [] })
  dadoresCorazones: Types.ObjectId[]
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: "Comentario", default: [] })
  respuestas: Types.ObjectId[]
  @Prop({ default: false })
  modificado: boolean
  @Prop({ default: true })
  disponible: boolean
}

export type DocumentoComentario = HydratedDocument<Comentario>
export const EsquemaComentario = SchemaFactory.createForClass(Comentario)