import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator"

export class CrearUsuarioDto {
  @IsString({ message: "El nombre debe ser un texto" })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  nombre: string
  @IsString({ message: "El apellido debe ser un texto" })
  @IsNotEmpty({ message: "El apellido es obligatorio" })
  apellido: string
  @IsEmail({}, { message: "El formato de correo no es válido" })
  @IsNotEmpty({ message: "El correo es obligatorio" })
  correo: string
  @IsString({ message: "El nombre de usuario debe ser un texto" })
  @IsNotEmpty({ message: "El nombre de usuario es obligatorio" })
  nombreUsuario: string
  @IsString({ message: "La contraseña debe ser un texto" })
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, { message: "La contraseña debe contener al menos una mayúscula y un número" })
  contrasenia: string
  @IsString({ message: "La fecha de nacimiento debe ser un texto" })
  @IsNotEmpty({ message: "La fecha de nacimiento es obligatoria" })
  fechaNacimiento: string
  @IsString({ message: "La descripción debe ser un texto" })
  @IsOptional()
  descripcion?: string
  @IsString({ message: "La URL de la imagen debe ser un texto" })
  @IsOptional()
  fotoPerfil?: string
  @IsIn(["usuario", "administrador"], { message: "El perfil debe ser usuario o administrador" })
  @IsOptional()
  perfil?: string
  @IsBoolean()
  @IsOptional()
  disponible?: boolean
}