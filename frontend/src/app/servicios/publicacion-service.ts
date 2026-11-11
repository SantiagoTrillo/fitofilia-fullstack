import { inject, Service, signal, Signal, WritableSignal } from "@angular/core"
import { ToastService } from "./toast-service"
import { PublicacionInterface } from "../interfaces/publicacion-interface"
import { HttpClient, HttpParams } from "@angular/common/http"
import { entorno } from "../../entornos/entorno"
import { firstValueFrom } from "rxjs"
import { OpcionesRecursoInterface } from "../interfaces/opciones-recurso-interface"
import { RespuestaPublicacionInterface } from "../interfaces/respuesta-publicacion-interface"

@Service()
export class PublicacionService {
  private urlApi: Signal<string> = signal<string>(`${ entorno.urlApi }/publicaciones`)

  private toastService: ToastService = inject(ToastService)
  private httpClient: HttpClient = inject(HttpClient)

  publicacionSeleccionada: WritableSignal<PublicacionInterface | null> = signal<PublicacionInterface | null>(null)

  async crearPublicacion(formData: FormData): Promise<PublicacionInterface | null> {
    try {
      return await firstValueFrom(this.httpClient.post<PublicacionInterface>(this.urlApi(), formData))
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al crear la publicación"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return null
    }
  }

  async obtenerPublicaciones(opciones: OpcionesRecursoInterface): Promise<RespuestaPublicacionInterface> {
    try {
      let parametros: HttpParams = new HttpParams()

      for (const [clave, valor] of Object.entries(opciones)) if (valor !== undefined) parametros = parametros.set(clave, valor)

      return await firstValueFrom(this.httpClient.get<RespuestaPublicacionInterface>(this.urlApi(), { params: parametros }))
    }
    catch (error: any) {
      const mensaje: string = error.error.message

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return { publicaciones: [], total: 0 }
    }
  }

  async editarPublicacion(idPublicacionBuscado: string, formData: FormData): Promise<PublicacionInterface | null> {
    try {
      return await firstValueFrom(this.httpClient.patch<PublicacionInterface>(`${ this.urlApi() }/${ idPublicacionBuscado }`, formData))
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al editar la publicación"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return null
    }
  }

  async eliminarPublicacion(idPublicacionBuscado: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpClient.delete<void>(`${ this.urlApi() }/${ idPublicacionBuscado }`))

      this.toastService.mostrarToast("Publicación eliminada con éxito", "exito")

      return true
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al eliminar la publicación"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return false
    }
  }

  async darCorazon(idPublicacionBuscado: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpClient.post(`${ this.urlApi() }/${ idPublicacionBuscado }/corazones`, null))

      return true
    }
    catch (error: any) {
      const mensaje: string = error.error?.message || "Error al crear la publicación"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return false
    }
  }

  async quitarCorazon(idPublicacionBuscado: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpClient.delete<void>(`${ this.urlApi() }/${ idPublicacionBuscado }/corazones`))

      return true
    }
    catch (error: any) {
      const mensaje: string = error.error?.message || "Error al crear la publicación"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return false
    }
  }

  seleccionarPublicacion(publicacionSeleccionada: PublicacionInterface): void { this.publicacionSeleccionada.set(publicacionSeleccionada) }
}