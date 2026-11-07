import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common"

@Injectable()
export class AdministradorGuard implements CanActivate {
  canActivate(contexto: ExecutionContext): boolean {
    const peticion: any = contexto.switchToHttp().getRequest()
    const usuario: any = peticion.usuario

    if (usuario?.perfil !== "administrador") throw new ForbiddenException("No tenés permiso para realizar esta acción")

    return true
  }
}