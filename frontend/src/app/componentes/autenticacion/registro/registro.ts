import { Component, inject, Signal, signal, WritableSignal } from "@angular/core"
import { Router } from "@angular/router"
import { AutenticacionService } from "../../../servicios/autenticacion-service"
import { UsuarioInterface } from "../../../interfaces/usuario-interface"
import { ModalConfirmacion } from "../../componentes-reutilizables/modal-confirmacion/modal-confirmacion"
import { FormularioUsuario } from "../../componentes-reutilizables/formulario-usuario/formulario-usuario"

@Component({
  selector: "app-registro",
  templateUrl: "./registro.html",
  styleUrl: "./registro.less",
  imports: [FormularioUsuario, ModalConfirmacion]
})
export class Registro {
  private autenticacionService: AutenticacionService = inject(AutenticacionService)
  private router: Router = inject(Router)

  protected titulo: Signal<string> = signal<string>("Registrate para poder acceder a la aplicación")
  protected textoBotonPrimario: Signal<string> = signal<string>("Registrarse")
  protected textoBotonSecundario: Signal<string> = signal<string>("Iniciar sesión")
  protected tipoFormulario: Signal<string> = signal<string>("registro")

  protected mostrarModalConfirmacion: WritableSignal<boolean> = signal<boolean>(false)
  protected rutaDestino: WritableSignal<string> = signal<string>("")
  protected datosIniciales: WritableSignal<UsuarioInterface | null> = signal<UsuarioInterface | null>(null)

  formularioModificado: WritableSignal<boolean> = signal<boolean>(false)
  registroExitoso: WritableSignal<boolean> = signal<boolean>(false)
  confirmacionAceptada: WritableSignal<boolean> = signal<boolean>(false)

  protected async registrarUsuario(formData: FormData): Promise<void> {
    const usuarioRegistrado: UsuarioInterface | null = await this.autenticacionService.registrarUsuario(formData)

    if (usuarioRegistrado) {
      this.registroExitoso.set(true)
      void this.router.navigate(["cargando"])
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