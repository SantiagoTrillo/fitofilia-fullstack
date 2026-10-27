import { IsInt, IsOptional, Min } from 'class-validator'

export class PaginacionDto {
  @IsOptional()
  @IsInt({ message: 'El offset debe ser un número entero' })
  @Min(0, { message: 'El offset no puede ser negativo' })
  offset?: number
  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser al menos 1' })
  limit?: number
  @IsOptional()
  orden?: string
  @IsOptional()
  autor?: string
  @IsOptional()
  titulo?: string
}