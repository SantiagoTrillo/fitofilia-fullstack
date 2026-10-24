import { Component, inject, signal, WritableSignal } from "@angular/core"
import { Router } from "@angular/router"
import { AutenticacionService } from "../../../../servicios/autenticacion-service"
import { UsuarioInterface } from "../../../../interfaces/usuario-interface"
import { ModalConfirmacion } from "../../../componentes-reutilizables/modal-confirmacion/modal-confirmacion"
import { ToastService } from "../../../../servicios/toast-service"
import { FormularioUsuario } from "../../../componentes-reutilizables/formulario-usuario/formulario-usuario"

@Component({
  selector: "app-edicion-perfil",
  templateUrl: "./edicion-perfil.html",
  styleUrl: "./edicion-perfil.less",
  imports: [FormularioUsuario, ModalConfirmacion]
})
export class EdicionPerfil {
  private autenticacionService: AutenticacionService = inject(AutenticacionService)
  private toastService: ToastService = inject(ToastService)
  private router: Router = inject(Router)

  protected mostrarModalConfirmacion: WritableSignal<boolean> = signal<boolean>(false)
  protected rutaDestino: WritableSignal<string> = signal<string>("")

  protected readonly titulo: string = "Editando datos del perfil"
  protected readonly textoBotonPrimario: string = "Guardar cambios"
  protected readonly textoBotonSecundario: string = "Cancelar"
  protected readonly rutaBotonSecundario: string = "/perfil"
  protected readonly tipoFormulario: string = "edicionPerfil"
  protected readonly datosIniciales: UsuarioInterface | null = this.autenticacionService.usuarioActual()

  formularioModificado: WritableSignal<boolean> = signal<boolean>(false)
  edicionExitosa: WritableSignal<boolean> = signal<boolean>(false)
  confirmacionAceptada: WritableSignal<boolean> = signal<boolean>(false)

  protected async editarPerfil(formData: FormData): Promise<void> {
    const perfilModificado: boolean = await this.autenticacionService.editarPerfil(formData)

    if (perfilModificado) {
      this.edicionExitosa.set(true)
      this.toastService.mostrarToast("Perfil actualizado correctamente", "exito")
      this.router.navigate(["/perfil"])
    }
  }

  protected aceptarSalida(): void {
    this.confirmacionAceptada.set(true)
    this.mostrarModalConfirmacion.set(false)
    this.router.navigate([this.rutaDestino()])
  }

  protected cancelarSalida(): void { this.mostrarModalConfirmacion.set(false) }

  solicitarSalida(url: string): void {
    this.rutaDestino.set(url)
    this.mostrarModalConfirmacion.set(true)
  }
}