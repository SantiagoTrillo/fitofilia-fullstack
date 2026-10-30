import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CrearPublicacionDto {
  @IsNotEmpty({ message: "El título es obligatorio" })
  @IsString({ message: "El título debe ser un texto" })
  titulo: string
  @IsOptional()
  @IsString({ message: "La URL de la imagen debe ser un texto" })
  imagen?: string
  @IsOptional()
  @IsString({ message: "El cuerpo debe ser un texto" })
  cuerpo?: string
  @IsOptional()
  @IsBoolean({ message: "El estado de la publicación debe ser un valor booleano" })
  disponible?: boolean
}