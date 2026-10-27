import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class IniciarSesionDto {
  @IsEmail({}, { message: "El formato de correo no es válido" })
  @IsNotEmpty({ message: "El correo es obligatorio" })
  correo: string
  @IsString({ message: "La contraseña debe ser un texto" })
  @IsNotEmpty({ message: "La contraseña es obligatorio" })
  contrasenia: string
}