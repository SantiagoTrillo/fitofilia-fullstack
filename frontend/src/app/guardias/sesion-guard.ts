import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { inject } from '@angular/core'
import { SesionService } from '../servicios/sesion-service'

export const sesionGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const sesionService: SesionService = inject(SesionService)
  const router: Router = inject(Router)

  const rutaActual: string = decodeURI(state.url)
  const rutaPublica: boolean = rutaActual === '/inicio-sesión' || rutaActual === '/registro'
  const sesionIniciada: boolean = !!sesionService.usuarioActual()

  if (rutaPublica && sesionIniciada) return router.createUrlTree(['perfil'])
  if (!rutaPublica && !sesionIniciada) return router.createUrlTree(['inicio-sesión'])

  return true
}