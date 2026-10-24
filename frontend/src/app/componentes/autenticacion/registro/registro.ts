import { Component, inject, signal, WritableSignal } from "@angular/core"
import { Router } from "@angular/router"
import { AutenticacionService } from "../../../servicios/autenticacion-service"
import { UsuarioInterface } from "../../../interfaces/usuario-interface"
import { ModalConfirmacion } from "../../componentes-reutilizables/modal-confirmacion/modal-confirmacion"
import { ToastService } from "../../../servicios/toast-service"
import { FormularioUsuario } from "../../componentes-reutilizables/formulario-usuario/formulario-usuario"

@Component({
  selector: "app-registro",
  templateUrl: "./registro.html",
  styleUrl: "./registro.less",
  imports: [FormularioUsuario, ModalConfirmacion]
})
export class Registro {
  private autenticacionService: AutenticacionService = inject(AutenticacionService)
  private toastService: ToastService = inject(ToastService)
  private router: Router = inject(Router)

  protected mostrarModalConfirmacion: WritableSignal<boolean> = signal<boolean>(false)
  protected rutaDestino: WritableSignal<string> = signal<string>("")

  protected readonly titulo: string = "Registrate para poder acceder a la aplicación"
  protected readonly textoBotonPrimario: string = "Registrarse"
  protected readonly textoBotonSecundario: string = "Iniciar sesión"
  protected readonly rutaBotonSecundario: string = "/inicio-sesión"
  protected readonly tipoFormulario: string = "registro"
  protected readonly datosIniciales: UsuarioInterface | null = null

  formularioModificado: WritableSignal<boolean> = signal<boolean>(false)
  registroExitoso: WritableSignal<boolean> = signal<boolean>(false)
  confirmacionAceptada: WritableSignal<boolean> = signal<boolean>(false)

  protected async registrarUsuario(formData: FormData): Promise<void> {
    const usuarioRegistrado: UsuarioInterface | null = await this.autenticacionService.registrarUsuario(formData)

    if (usuarioRegistrado) {
      this.registroExitoso.set(true)
      this.toastService.mostrarToast("Registro completado correctamente", "exito")
      this.router.navigate([""])
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