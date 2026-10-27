import { Transform, TransformFnParams, Type } from "class-transformer"
import { IsBoolean, IsIn, IsInt, IsMongoId, IsOptional, IsString, Min } from "class-validator"

export class OpcionesDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams): any => value === "true" ? true : value === "false" ? false : value)
  @IsBoolean({ message: "El estado de las publicaciones debe ser un booleano" })
  disponible?: string
  @IsOptional()
  @IsIn(["fecha", "corazones"], { message: `El orden debe ser "fecha" o "corazones"` })
  orden?: string
  @IsOptional()
  @IsMongoId({ message: "El ID del autor debe ser un ObjectId válido" })
  autor?: string
  @IsOptional()
  @IsString({ message: "El título debe ser un texto" })
  titulo?: string
  @IsOptional()
  @Type((): NumberConstructor => Number)
  @IsInt({ message: 'El offset debe ser un número entero' })
  @Min(0, { message: 'El offset no puede ser negativo' })
  offset?: number
  @IsOptional()
  @Type((): NumberConstructor => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser al menos 1' })
  limit?: number
}