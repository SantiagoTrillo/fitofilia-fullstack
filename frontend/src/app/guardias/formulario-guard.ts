import { CanDeactivateFn } from "@angular/router"

export const formularioGuard: CanDeactivateFn<unknown> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  return true
}