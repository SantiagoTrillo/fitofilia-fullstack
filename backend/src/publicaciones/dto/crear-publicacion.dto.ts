import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CrearPublicacionDto {
  @IsString({ message: "El título debe ser un texto" })
  @IsNotEmpty({ message: "El título es obligatorio" })
  titulo: string
  @IsString({ message: "La URL de la imagen debe ser un texto" })
  @IsOptional()
  imagen?: string
  @IsString({ message: "El cuerpo debe ser un texto" })
  @IsOptional()
  cuerpo?: string
  @IsBoolean()
  @IsOptional()
  disponible?: boolean
}