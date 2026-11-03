import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http"
import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AutenticacionService } from "../servicios/autenticacion-service"
import { catchError, Observable, throwError } from "rxjs"

export const autenticacionInterceptor: HttpInterceptorFn = (
  peticion: HttpRequest<unknown>, siguiente: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const autenticacionService: AutenticacionService = inject(AutenticacionService)
  const router: Router = inject(Router)

  const token: string | null = autenticacionService.token()

  if (token) peticion = peticion.clone({ setHeaders: { Authorization: `Bearer ${ token }` } })

  return siguiente(peticion).pipe(
    catchError((error: unknown): Observable<never> => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        autenticacionService.cerrarSesion()

        void router.navigate(["/inicio-sesión"])
      }

      return throwError((): unknown => error)
    })
  )
}