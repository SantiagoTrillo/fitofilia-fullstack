import { Component, inject, Signal, signal, WritableSignal } from "@angular/core"
import { FormularioUsuario } from "../../../../componentes-reutilizables/formulario-usuario/formulario-usuario"
import { ModalConfirmacion } from "../../../../componentes-reutilizables/modal-confirmacion/modal-confirmacion"
import { PublicacionInterface } from "../../../../../interfaces/publicacion-interface"
import { PublicacionService } from "../../../../../servicios/publicacion-service"
import { ToastService } from "../../../../../servicios/toast-service"
import { Router } from "@angular/router"
import { Location } from "@angular/common"

@Component({
  selector: "app-edicion-publicacion",
  styleUrl: "./edicion-publicacion.less",
  templateUrl: "./edicion-publicacion.html",
  imports: [FormularioUsuario, ModalConfirmacion]
})
export class EdicionPublicacion {
  private publicacionService: PublicacionService = inject(PublicacionService)
  private toastService: ToastService = inject(ToastService)
  private router: Router = inject(Router)
  private location: Location = inject(Location)

  protected mostrarModalConfirmacion: WritableSignal<boolean> = signal<boolean>(false)
  protected rutaDestino: WritableSignal<string> = signal<string>("")
  protected datosIniciales: Signal<PublicacionInterface | null> = signal<PublicacionInterface | null>(
    this.router.currentNavigation()?.extras.state?.["publicacion"] ?? window.history.state["publicacion"] ?? null
  )

  formularioModificado: WritableSignal<boolean> = signal<boolean>(false)
  edicionExitosa: WritableSignal<boolean> = signal<boolean>(false)
  confirmacionAceptada: WritableSignal<boolean> = signal<boolean>(false)

  protected ngOnInit(): void { if (!this.datosIniciales()) void this.router.navigate(["/"]) }

  protected async editarPublicacion(formData: FormData): Promise<void> {
    const publicacion: PublicacionInterface | null = this.datosIniciales()

    if (!publicacion) {
      void this.router.navigate(["/"])

      return
    }

    const publicacionEditada: PublicacionInterface | null = await this.publicacionService.editarPublicacion(publicacion._id, formData)

    if (publicacionEditada) {
      this.publicacionService.seleccionarPublicacion({ ...publicacion, ...publicacionEditada, autor: publicacion.autor })
      this.edicionExitosa.set(true)
      this.toastService.mostrarToast("Publicación editada correctamente", "exito")
      this.location.back()
    }
  }

  protected aceptarSalida(): void {
    this.confirmacionAceptada.set(true)
    this.mostrarModalConfirmacion.set(false)

    void this.router.navigateByUrl(this.rutaDestino(), { replaceUrl: true })
  }

  protected cancelarSalida(): void { this.mostrarModalConfirmacion.set(false) }

  solicitarSalida(url: string): void {
    this.rutaDestino.set(url)
    this.mostrarModalConfirmacion.set(true)
  }
}