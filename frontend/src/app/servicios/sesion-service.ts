import { inject, Service, signal, WritableSignal } from "@angular/core"
import { ToastService } from "./toast-service"
import { UsuarioInterface } from "../interfaces/usuario-interface"

@Service()
export class SesionService {
  private toastService: ToastService = inject(ToastService)

  usuarioActual: WritableSignal<UsuarioInterface | null> = signal<UsuarioInterface | null>(
    sessionStorage.getItem("usuarioActual") ? JSON.parse(sessionStorage.getItem("usuarioActual")!) : null
  )

  async registrarUsuario(usuarioNuevo: UsuarioInterface): Promise<UsuarioInterface | null> {
    return null
  }

  async iniciarSesion(correo: string, contrasenia: string): Promise<UsuarioInterface | null> {
    return null
  }

  cerrarSesion(): void {
    this.usuarioActual.set(null)
    sessionStorage.removeItem("usuarioActual")
  }
}