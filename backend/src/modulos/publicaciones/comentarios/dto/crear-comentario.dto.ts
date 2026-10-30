import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CrearComentarioDto {
  @IsNotEmpty({ message: "El texto es obligatorio" })
  @IsString({ message: "El texto debe ser un texto" })
  texto: string
  @IsOptional()
  @IsBoolean({ message: "El estado de la publicación debe ser un valor booleano" })
  disponible?: boolean
}