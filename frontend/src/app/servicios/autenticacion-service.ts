import {inject, Service, signal, WritableSignal} from "@angular/core"
import {ToastService} from "./toast-service"
import {UsuarioInterface} from "../interfaces/usuario-interface"
import {HttpClient} from "@angular/common/http"
import {entorno} from "../../entornos/entorno"
import {firstValueFrom} from "rxjs"

@Service()
export class AutenticacionService {
  private toastService: ToastService = inject(ToastService)
  private httpClient: HttpClient = inject(HttpClient)
  private readonly urlApi: string = `${ entorno.urlApi }`

  usuarioActual: WritableSignal<UsuarioInterface | null> = signal<UsuarioInterface | null>(
    sessionStorage.getItem("usuarioActual") ? JSON.parse(sessionStorage.getItem("usuarioActual")!) : null
  )

  async iniciarSesion(correo: string, contrasenia: string): Promise<UsuarioInterface | null> {
    try {
      const usuarioAutenticado: UsuarioInterface = await firstValueFrom(
        this.httpClient.post<UsuarioInterface>(`${ this.urlApi }/inicio-sesion`, { correo, contrasenia })
      )

      this.usuarioActual.set(usuarioAutenticado)
      sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioAutenticado))

      return usuarioAutenticado
    } catch (error: any) {
      const mensaje: string = error.error.message

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return null
    }
  }

  async registrarUsuario(usuarioNuevo: any): Promise<UsuarioInterface | null> {
    try {
      const usuarioRegistrado: UsuarioInterface = await firstValueFrom(
        this.httpClient.post<UsuarioInterface>(`${ this.urlApi }/registro`, usuarioNuevo)
      )

      this.usuarioActual.set(usuarioRegistrado)
      sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioRegistrado))

      return usuarioRegistrado
    } catch (error: any) {
      const mensaje: string = error.error.message

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return null
    }
  }

  async editarPerfil(perfilEditado: FormData): Promise<boolean> {
    try {
      const usuarioActualizado: UsuarioInterface = await firstValueFrom(
        this.httpClient.patch<UsuarioInterface>(`${ this.urlApi }/usuarios/${ this.usuarioActual()?._id }`, perfilEditado)
      )
      this.usuarioActual.set(usuarioActualizado)
      sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioActualizado))
      return true
    } catch (error: any) {
      const mensaje: string = error.error.message

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return false
    }
  }

  cerrarSesion(): void {
    this.usuarioActual.set(null)
    sessionStorage.removeItem("usuarioActual")
  }
}