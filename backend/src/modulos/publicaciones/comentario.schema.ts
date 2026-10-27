import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Schema as MongooseSchema, Types } from "mongoose"

@Schema({ timestamps: true })
export class Comentario {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Usuario", required: true })
  autor: Types.ObjectId
  @Prop({ required: [true, "El texto del comentario es obligatorio"], trim: true, minlength: 1, maxlength: 300 })
  texto: string
  @Prop({ default: 0 })
  corazones: number
}

export const EsquemaComentario = SchemaFactory.createForClass(Comentario)