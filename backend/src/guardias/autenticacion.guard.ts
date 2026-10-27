import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AutenticacionGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const peticion: any = contexto.switchToHttp().getRequest()
    const cabeceraAutorizacion: string | undefined = peticion.headers.authorization

    if (!cabeceraAutorizacion) throw new UnauthorizedException("Token no proporcionado")

    const token: string = cabeceraAutorizacion.replace("Bearer ", "")

    try {
      peticion.usuario = await this.jwtService.verifyAsync(token)

      return true
    } catch { throw new UnauthorizedException("Token inválido o vencido") }
  }
}