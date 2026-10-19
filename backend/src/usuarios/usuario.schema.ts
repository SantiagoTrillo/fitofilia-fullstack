import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema({ collection: "usuarios" })
export class Usuario {
  @Prop({ required: true }) nombre: string
  @Prop({ required: true }) apellido: string
  @Prop({ required: true, unique: true }) correo: string
  @Prop({ required: true, unique: true }) nombreUsuario: string
  @Prop({ required: true }) contrasenia: string
  @Prop({ required: true }) fechaNacimiento: string
  @Prop({ default: "" }) descripcion: string
  @Prop({ default: "" }) fotoPerfil: string
  @Prop({ default: "usuario", enum: ["usuario", "administrador"] }) perfil: string
  @Prop({ default: true }) disponible: boolean
}

export type DocumentoUsuario = HydratedDocument<Usuario>
export const EsquemaUsuario = SchemaFactory.createForClass(Usuario)