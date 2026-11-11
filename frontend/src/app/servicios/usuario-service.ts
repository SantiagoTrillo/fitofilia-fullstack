import { inject, Service, signal, Signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { firstValueFrom } from "rxjs"
import { entorno } from "../../entornos/entorno"
import { ToastService } from "./toast-service"
import { UsuarioInterface } from "../interfaces/usuario-interface"

@Service()
export class UsuarioService {
  private urlApi: Signal<string> = signal<string>(`${ entorno.urlApi }/usuarios`)

  private httpClient: HttpClient = inject(HttpClient)
  private toastService: ToastService = inject(ToastService)

  async buscarTodos(): Promise<UsuarioInterface[]> {
    try { return await firstValueFrom(this.httpClient.get<UsuarioInterface[]>(this.urlApi())) }
    catch (error: any) {
      const mensaje: string = error.error?.message || "Error al obtener los usuarios"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return []
    }
  }

  async crear(formData: FormData): Promise<UsuarioInterface | null> {
    try {
      const usuarioCreado: UsuarioInterface = await firstValueFrom(this.httpClient.post<UsuarioInterface>(this.urlApi(), formData))

      this.toastService.mostrarToast("Usuario creado correctamente", "exito")

      return usuarioCreado
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al crear el usuario"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return null
    }
  }

  async cambiarDisponibilidad(usuario: UsuarioInterface): Promise<boolean> {
    try {
      if (usuario.disponible) await firstValueFrom(this.httpClient.delete<void>(`${ this.urlApi() }/${ usuario._id }`))
      else await firstValueFrom(this.httpClient.post<UsuarioInterface>(`${ this.urlApi() }/${ usuario._id }`, null))

      return true
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al cambiar el estado del usuario"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return false
    }
  }
}