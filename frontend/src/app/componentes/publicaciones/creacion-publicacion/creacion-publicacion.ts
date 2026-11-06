import { Component, inject, signal, WritableSignal } from "@angular/core"
import { Router } from "@angular/router"
import { PublicacionService } from "../../../servicios/publicacion-service"
import { ToastService } from "../../../servicios/toast-service"
import { FormularioUsuario } from "../../componentes-reutilizables/formulario-usuario/formulario-usuario"
import { ModalConfirmacion } from "../../componentes-reutilizables/modal-confirmacion/modal-confirmacion"
import { PublicacionInterface } from "../../../interfaces/publicacion-interface"

@Component({
  selector: "app-creacion-publicacion",
  templateUrl: "./creacion-publicacion.html",
  styleUrl: "./creacion-publicacion.less",
  imports: [FormularioUsuario, ModalConfirmacion]
})
export class CreacionPublicacion {
  private publicacionService: PublicacionService = inject(PublicacionService)
  private toastService: ToastService = inject(ToastService)
  private router: Router = inject(Router)

  protected mostrarModalConfirmacion: WritableSignal<boolean> = signal<boolean>(false)
  protected rutaDestino: WritableSignal<string> = signal<string>("")

  protected readonly titulo: string = "Crear nueva publicación"
  protected readonly textoBotonPrimario: string = "Publicar"
  protected readonly textoBotonSecundario: string = "Cancelar"
  protected readonly tipoFormulario: string = "creacionPublicacion"

  formularioModificado: WritableSignal<boolean> = signal<boolean>(false)
  publicacionExitosa: WritableSignal<boolean> = signal<boolean>(false)
  confirmacionAceptada: WritableSignal<boolean> = signal<boolean>(false)

  protected async crearPublicacion(formData: FormData): Promise<void> {
    const resultado: PublicacionInterface | null = await this.publicacionService.crearPublicacion(formData)

    if (resultado) {
      this.publicacionExitosa.set(true)
      this.toastService.mostrarToast("Publicación creada correctamente", "exito")
      void this.router.navigate(["/"])
    }
  }

  protected aceptarSalida(): void {
    this.confirmacionAceptada.set(true)
    this.mostrarModalConfirmacion.set(false)
    void this.router.navigate([this.rutaDestino()])
  }

  protected cancelarSalida(): void { this.mostrarModalConfirmacion.set(false) }

  solicitarSalida(url: string): void {
    this.rutaDestino.set(url)
    this.mostrarModalConfirmacion.set(true)
  }
}