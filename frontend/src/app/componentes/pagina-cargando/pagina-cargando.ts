import { Component, inject, input, InputSignal } from "@angular/core"
import { AutenticacionService } from "../../servicios/autenticacion-service"
import { Router } from "@angular/router"
import { ToastService } from "../../servicios/toast-service"

@Component({
  selector: "app-pagina-cargando",
  templateUrl: "./pagina-cargando.html",
  styleUrl: "./pagina-cargando.less"
})
export class PaginaCargando {
  private autenticacionService: AutenticacionService = inject(AutenticacionService)
  private router: Router = inject(Router)
  private toastService: ToastService = inject(ToastService)

  modoInline: InputSignal<boolean> = input(false)
  texto: InputSignal<string> = input<string>("Validando token...")

  protected async ngOnInit(): Promise<void> {
    if (this.modoInline()) return

    const rutaAnterior: string = decodeURI(this.router.currentNavigation()?.previousNavigation?.finalUrl?.toString() ?? "")
    const mostrarToast: boolean = rutaAnterior === "/registro" || rutaAnterior === "/inicio-sesión"
    const mensajeExitoso: string = rutaAnterior === "/registro" ? "Registro completado correctamente" : "Sesión iniciada correctamente"

    const token: string | null = this.autenticacionService.token()

    if (!token) {
      this.autenticacionService.cerrarSesion()
      void this.router.navigate(["/inicio-sesión"])

      return
    }

    const autorizacion: boolean = await this.autenticacionService.autorizarAcceso(token)

    if (!autorizacion) {
      this.autenticacionService.cerrarSesion()
      void this.router.navigate(["/inicio-sesión"])

      return
    }

    this.autenticacionService.validarToken()

    const rutaDestino: string = this.autenticacionService.rutaValidada() ?? "/"

    this.autenticacionService.rutaValidada.set(null)

    const muroCargado: boolean = await this.router.navigateByUrl(rutaDestino)

    if (muroCargado && mostrarToast) this.toastService.mostrarToast(mensajeExitoso, "exito")
  }
}