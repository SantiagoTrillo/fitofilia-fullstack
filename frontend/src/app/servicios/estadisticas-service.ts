import { inject, Service } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { firstValueFrom } from "rxjs"
import { entorno } from "../../entornos/entorno"

@Service()
export class EstadisticasService {
  private httpClient: HttpClient = inject(HttpClient)
  private readonly urlApi: string = `${ entorno.urlApi }/estadisticas`

  private crearParametros(fechaDesde: string, fechaHasta: string): HttpParams {
    return new HttpParams().set("fechaDesde", fechaDesde).set("fechaHasta", fechaHasta)
  }

  async contarPublicacionesPeriodo(fechaDesde: string, fechaHasta: string): Promise<number> {
    return firstValueFrom(
      this.httpClient.get<number>(`${ this.urlApi }/publicaciones`, { params: this.crearParametros(fechaDesde, fechaHasta) })
    )
  }

  async contarComentariosPeriodo(fechaDesde: string, fechaHasta: string): Promise<number> {
    return firstValueFrom(
      this.httpClient.get<number>(`${ this.urlApi }/comentarios`, { params: this.crearParametros(fechaDesde, fechaHasta) })
    )
  }

  async contarComentariosPublicacionPeriodo(idPublicacion: string, fechaDesde: string, fechaHasta: string): Promise<number> {
    return firstValueFrom(
      this.httpClient.get<number>(
        `${ this.urlApi }/publicaciones/${ idPublicacion }/comentarios`, { params: this.crearParametros(fechaDesde, fechaHasta) }
      )
    )
  }
}