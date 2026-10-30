import { inject, Service } from "@angular/core"
import { ToastService } from "./toast-service"
import { HttpClient, HttpParams } from "@angular/common/http"
import { entorno } from "../../entornos/entorno"
import { OpcionesRecursoInterface } from "../interfaces/opciones-recurso-interface"
import { ComentarioInterface } from "../interfaces/comentario-interface"
import { firstValueFrom } from "rxjs"
import { RespuestaComentarioInterface } from "../interfaces/respuesta-comentario-interface"

@Service()
export class ComentarioService {
  private toastService: ToastService = inject(ToastService)
  private httpClient: HttpClient = inject(HttpClient)
  private readonly urlApi: string = `${ entorno.urlApi }/publicaciones`

  async crearComentario(idPublicacionBuscado: string, texto: string): Promise<ComentarioInterface | null> {
    try {
      return await firstValueFrom(
        this.httpClient.post<ComentarioInterface>(`${ this.urlApi }/${ idPublicacionBuscado }/comentarios`, texto)
      )
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al crear el comentario"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return null
    }
  }

  async obtenerComentarios(idPublicacionBuscado: string, opciones: OpcionesRecursoInterface): Promise<RespuestaComentarioInterface> {
    try {
      let parametros: HttpParams = new HttpParams()

      for (const [clave, valor] of Object.entries(opciones)) if (valor !== undefined) parametros = parametros.set(clave, valor)

      return await firstValueFrom(
        this.httpClient.get<RespuestaComentarioInterface>(`${ this.urlApi }/${ idPublicacionBuscado }/comentarios`, { params: parametros })
      )
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al obtener los comentarios"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return { comentarios: [], total: 0 }
    }
  }

  async eliminarComentario(idPublicacionBuscado: string, idComentarioBuscado: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpClient.delete<void>(`${ this.urlApi }/${ idPublicacionBuscado }/comentarios/${ idComentarioBuscado }`)
      )

      this.toastService.mostrarToast("Comentario eliminado con éxito", "exito")

      return true
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al eliminar el comentario"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return false
    }
  }
}