import { inject, Service, signal, Signal } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { firstValueFrom } from "rxjs"
import { entorno } from "../../entornos/entorno"

@Service()
export class EstadisticasService {
  private urlApi: Signal<string> = signal<string>(`${ entorno.urlApi }/estadisticas`)

  private httpClient: HttpClient = inject(HttpClient)

  private crearParametros(fechaDesde: string, fechaHasta: string): HttpParams {
    return new HttpParams().set("fechaDesde", fechaDesde).set("fechaHasta", fechaHasta)
  }

  async contarPublicacionesUsuariosPeriodo(
    fechaDesde: string, fechaHasta: string
  ): Promise<{ nombreUsuario: string; cantidadPublicaciones: number }[]> {
    return firstValueFrom(
      this.httpClient.get<{ nombreUsuario: string; cantidadPublicaciones: number }[]>(
        `${ this.urlApi() }/usuarios/publicaciones`, { params: this.crearParametros(fechaDesde, fechaHasta) }
      )
    )
  }

  async contarComentariosPeriodo(fechaDesde: string, fechaHasta: string): Promise<number> {
    return firstValueFrom(
      this.httpClient.get<number>(`${ this.urlApi() }/comentarios`, { params: this.crearParametros(fechaDesde, fechaHasta) })
    )
  }

  async contarComentariosPublicacionesPeriodo(
    fechaDesde: string, fechaHasta: string
  ): Promise<{ tituloPublicacion: string; cantidadComentarios: number }[]> {
    return firstValueFrom(
      this.httpClient.get<{ tituloPublicacion: string; cantidadComentarios: number }[]>(
        `${ this.urlApi() }/publicaciones/comentarios`, { params: this.crearParametros(fechaDesde, fechaHasta) }
      )
    )
  }
}