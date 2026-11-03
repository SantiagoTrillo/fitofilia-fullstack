import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { inject } from '@angular/core'
import { AutenticacionService } from '../servicios/autenticacion-service'

export const autenticacionGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const sesionService: AutenticacionService = inject(AutenticacionService)
  const router: Router = inject(Router)

  const rutaActual: string = decodeURI(state.url)
  const rutaPublica: boolean = rutaActual === '/inicio-sesión' || rutaActual === '/registro'
  const sesionIniciada: boolean = !!sesionService.usuarioActual()
  const rutaAnterior: string = decodeURI(router.currentNavigation()?.previousNavigation?.finalUrl?.toString() ?? '')
  const accesoPrevio: boolean = rutaAnterior === '/inicio-sesión' || rutaAnterior === '/registro'

  if (!rutaPublica && !sesionIniciada) return router.createUrlTree(['inicio-sesión'])
  if (rutaActual === '/cargando' && !accesoPrevio) return router.createUrlTree([''])
  if (rutaPublica && sesionIniciada) return router.createUrlTree(['perfil'])

  return true
}