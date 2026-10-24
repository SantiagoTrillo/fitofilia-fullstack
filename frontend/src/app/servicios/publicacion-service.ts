import { inject, Service, signal, WritableSignal } from "@angular/core"
import { ToastService } from "./toast-service"
import { PublicacionInterface } from "../interfaces/publicacion-interface"
import { HttpClient } from "@angular/common/http"
import { entorno } from "../../entornos/entorno"
import { firstValueFrom } from "rxjs"

@Service()
export class PublicacionService {
  private toastService: ToastService = inject(ToastService)
  private httpClient: HttpClient = inject(HttpClient)
  private readonly urlApi: string = `${ entorno.urlApi }/publicaciones`

  publicacionSeleccionada: WritableSignal<PublicacionInterface | null> = signal<PublicacionInterface | null>(null)

  async obtenerPublicaciones(): Promise<PublicacionInterface[]> {
    try { return await firstValueFrom(this.httpClient.get<PublicacionInterface[]>(this.urlApi)) }
    catch (error: any) {
      const mensaje: string = error.error.message

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return []
    }
  }

  seleccionarPublicacion(publicacionSeleccionada: PublicacionInterface): void { this.publicacionSeleccionada.set(publicacionSeleccionada) }

  async crearPublicacion(formData: FormData): Promise<PublicacionInterface | null> {
    try {
      return await firstValueFrom(this.httpClient.post<PublicacionInterface>(this.urlApi, formData))
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al crear la publicación"
      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")
      return null
    }
  }
}