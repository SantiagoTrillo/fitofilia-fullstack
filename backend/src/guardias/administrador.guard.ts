import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common"

@Injectable()
export class AdministradorGuard implements CanActivate {
  canActivate(contexto: ExecutionContext): boolean {
    const peticion: any = contexto.switchToHttp().getRequest()
    const usuario: any = peticion.usuario

    if (usuario?.rol !== "administrador") throw new ForbiddenException("Acceso denegado: se requieren permisos de administrador")

    return true
  }
}