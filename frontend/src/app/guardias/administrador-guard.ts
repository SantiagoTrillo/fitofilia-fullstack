import { CanActivateFn, Router, UrlTree } from "@angular/router"
import { inject } from "@angular/core"
import { AutenticacionService } from "../servicios/autenticacion-service"

export const administradorGuard: CanActivateFn = (): boolean | UrlTree => {
  const autenticacionService: AutenticacionService = inject(AutenticacionService)
  const router: Router = inject(Router)

  if (autenticacionService.usuarioActual()?.perfil !== "administrador") return router.createUrlTree(["/"])

  return true
}