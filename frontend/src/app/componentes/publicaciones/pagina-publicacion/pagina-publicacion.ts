import { Component, computed, inject, Signal, signal, WritableSignal } from "@angular/core"
import { PublicacionService } from "../../../servicios/publicacion-service"
import { Publicacion } from "../muro-publicaciones/publicacion/publicacion"
import { BotonVolver } from "../../componentes-reutilizables/boton-volver/boton-volver"
import { Comentario } from "./comentario/comentario"
import { ComentarioInterface } from "../../../interfaces/comentario-interface"
import { ComentarioService } from "../../../servicios/comentario-service"
import { RespuestaComentarioInterface } from "../../../interfaces/respuesta-comentario-interface"

@Component({
  selector: "app-pagina-publicacion",
  templateUrl: "./pagina-publicacion.html",
  styleUrl: "./pagina-publicacion.less",
  imports: [Publicacion, BotonVolver, Comentario]
})
export class PaginaPublicacion {
  private comentariosPagina: Signal<number> = signal<number>(5)

  private comentarioService: ComentarioService = inject(ComentarioService)

  protected comentariosDisponibles: WritableSignal<ComentarioInterface[]> = signal<ComentarioInterface[]>([])
  protected totalComentarios: WritableSignal<number> = signal<number>(0)
  protected paginaSeleccionada: WritableSignal<number> = signal<number>(1)
  protected cantidadPaginas: Signal<number> = computed((): number => Math.ceil(this.totalComentarios() / this.comentariosPagina()))

  protected publicacionService: PublicacionService = inject(PublicacionService)

  private async cargarComentarios(): Promise<void> {
    const respuesta: RespuestaComentarioInterface = await this.comentarioService.obtenerComentarios(
      this.publicacionService.publicacionSeleccionada()!._id,
      { disponible: true, limit: this.comentariosPagina(), offset: (this.paginaSeleccionada() - 1) * this.comentariosPagina() }
    )
    const ultimaPagina: number = Math.max(1, Math.ceil(respuesta.total / this.comentariosPagina()))

    if (this.paginaSeleccionada() > ultimaPagina) return this.seleccionarPagina(ultimaPagina)

    this.comentariosDisponibles.set(respuesta.comentarios)
    this.totalComentarios.set(respuesta.total)
  }

  protected async ngOnInit(): Promise<void> { await this.cargarComentarios() }

  protected async actualizarComentarios(idComentarioBorrado: string): Promise<void> {
    this.comentariosDisponibles.update(
      (comentarios: ComentarioInterface[]): ComentarioInterface[] =>
        comentarios.filter((comentario: ComentarioInterface): boolean => comentario._id !== idComentarioBorrado)
    )
    this.totalComentarios.update((total: number): number => Math.max(0, total -1))

    const ultimaPagina: number = Math.max(1, this.cantidadPaginas())

    if (this.paginaSeleccionada() > ultimaPagina) await this.seleccionarPagina(ultimaPagina)
  }

  protected async seleccionarPagina(paginaSeleccionada: number): Promise<void> {
    this.paginaSeleccionada.set(paginaSeleccionada)
    await this.cargarComentarios()
  }
}