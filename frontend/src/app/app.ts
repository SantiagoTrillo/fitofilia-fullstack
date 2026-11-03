import { Component, inject } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { Navbar } from "./componentes/componentes-reutilizables/navbar/navbar"
import { AutenticacionService } from "./servicios/autenticacion-service"
import { Toast } from "./componentes/componentes-reutilizables/toast/toast"
import { ModalConfirmacion } from "./componentes/componentes-reutilizables/modal-confirmacion/modal-confirmacion"

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
  imports: [RouterOutlet, Navbar, Toast, ModalConfirmacion]
})
export class App {
  private router: Router = inject(Router)

  protected sesionService: AutenticacionService = inject(AutenticacionService)

  protected async extenderSesion(): Promise<void> {
    this.sesionService.cerrarModal()

    const sesionExtendida: boolean = this.sesionService.token() ? await this.sesionService.refrescarToken() : false

    if (!sesionExtendida) {
      this.sesionService.cerrarSesion()
      void this.router.navigate(["/inicio-sesión"])
    }
  }

  protected cerrarModal(): void { this.sesionService.cerrarModal() }
}