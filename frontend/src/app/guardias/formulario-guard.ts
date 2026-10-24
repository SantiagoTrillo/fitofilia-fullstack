import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from "@angular/router"

interface ComponenteConFormulario {
  formularioModificado(): boolean
  registroExitoso?: () => boolean
  edicionExitosa?: () => boolean
  publicacionExitosa?: () => boolean
  confirmacionAceptada(): boolean
  solicitarSalida(url: string): void
}

export const formularioGuard: CanDeactivateFn<ComponenteConFormulario> = (
  component: ComponenteConFormulario, _currentRoute: ActivatedRouteSnapshot, _currentState: RouterStateSnapshot, nextState: RouterStateSnapshot
): boolean => {
  const guardadoExitoso: boolean = component.registroExitoso?.() || component.edicionExitosa?.() || component.publicacionExitosa?.() || false
  if (component.formularioModificado() && !guardadoExitoso && !component.confirmacionAceptada()) {
    component.solicitarSalida(nextState.url)
    return false
  } else return true
}