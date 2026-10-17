import { CanActivateFn } from "@angular/router"

export const redireccionGuard: CanActivateFn = (route, state) => {
  return true
}