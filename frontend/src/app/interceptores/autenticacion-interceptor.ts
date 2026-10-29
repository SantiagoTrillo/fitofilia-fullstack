import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http"
import { inject } from "@angular/core"
import { AutenticacionService } from "../servicios/autenticacion-service"
import {Observable} from "rxjs";

export const autenticacionInterceptor: HttpInterceptorFn = (peticion: HttpRequest<unknown>, siguiente: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const autenticacionService: AutenticacionService = inject(AutenticacionService)
  const token: string | null = autenticacionService.token()

  if (token) peticion = peticion.clone({ setHeaders: { Authorization: `Bearer ${ token }` } })

  return siguiente(peticion)
}