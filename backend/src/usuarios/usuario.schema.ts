import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema({ collection: "usuarios", timestamps: true })
export class Usuario {
  @Prop({ required: [true, "El nombre es obligatorio"], trim: true, minlength: 2, maxlength: 50 })
  nombre: string
  @Prop({ required: [true, "El apellido es obligatorio"], trim: true, minlength: 2, maxlength: 50 })
  apellido: string
  @Prop({ required: [true, "El correo es obligatorio"], unique: true, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, "El formato de correo no es válido"] })
  correo: string
  @Prop({ required: [true, "El nombre de usuario es obligatorio"], unique: true, trim: true, minlength: 2, maxlength: 30 })
  nombreUsuario: string
  @Prop({ required: [true, "La contraseña es obligatoria"] })
  contrasenia: string
  @Prop({ required: [true, "La fecha de nacimiento es obligatoria"] })
  fechaNacimiento: string
  @Prop({ default: "", maxlength: 75, trim: true })
  descripcion: string
  @Prop({ default: "" })
  fotoPerfil: string
  @Prop({ default: "usuario", enum: ["usuario", "administrador"] })
  perfil: string
  @Prop({ default: true })
  disponible: boolean
}

export type DocumentoUsuario = HydratedDocument<Usuario>
export const EsquemaUsuario = SchemaFactory.createForClass(Usuario)