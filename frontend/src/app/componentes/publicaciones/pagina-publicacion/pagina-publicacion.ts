import { Component, inject, Signal, signal, ViewChild, WritableSignal } from "@angular/core"
import { PublicacionService } from "../../../servicios/publicacion-service"
import { Publicacion } from "../muro-publicaciones/publicacion/publicacion"
import { BotonVolver } from "../../componentes-reutilizables/boton-volver/boton-volver"
import { Comentario } from "./comentario/comentario"
import { ComentarioInterface } from "../../../interfaces/comentario-interface"
import { ComentarioService } from "../../../servicios/comentario-service"
import { RespuestaComentarioInterface } from "../../../interfaces/respuesta-comentario-interface"
import { FormularioComentario } from "./formulario-comentario/formulario-comentario"
import { ToastService } from "../../../servicios/toast-service"

@Component({
  selector: "app-pagina-publicacion",
  templateUrl: "./pagina-publicacion.html",
  styleUrl: "./pagina-publicacion.less",
  imports: [Publicacion, BotonVolver, Comentario, FormularioComentario]
})
export class PaginaPublicacion {
  private comentariosPagina: Signal<number> = signal<number>(5)

  private comentarioService: ComentarioService = inject(ComentarioService)
  private toastService: ToastService = inject(ToastService)

  @ViewChild(FormularioComentario) private formularioComentario!: FormularioComentario

  protected comentariosDisponibles: WritableSignal<ComentarioInterface[]> = signal<ComentarioInterface[]>([])
  protected totalComentarios: WritableSignal<number> = signal<number>(0)
  protected paginaSeleccionada: WritableSignal<number> = signal<number>(1)

  comentarioExitoso: WritableSignal<boolean> = signal<boolean>(false)

  protected publicacionService: PublicacionService = inject(PublicacionService)

  protected async ngOnInit(): Promise<void> { await this.cargarComentarios() }

  protected async cargarComentarios(): Promise<void> {
    const respuesta: RespuestaComentarioInterface = await this.comentarioService.obtenerComentarios(
      this.publicacionService.publicacionSeleccionada()!._id,
      { disponible: true, limit: this.comentariosPagina(), offset: this.comentariosDisponibles().length }
    )

    this.comentariosDisponibles.update(
      (comentarios: ComentarioInterface[]): ComentarioInterface[] => [...comentarios, ...respuesta.comentarios]
    )
    this.totalComentarios.set(respuesta.total)
  }

  protected async actualizarComentarios(comentarioModificado: ComentarioInterface, tipoModificacion: string): Promise<void> {
    if (tipoModificacion === "eliminacion") {
      this.comentariosDisponibles.update((comentarios: ComentarioInterface[]): ComentarioInterface[] =>
        comentarios.filter((comentario: ComentarioInterface): boolean => comentario._id !== comentarioModificado._id))
      this.totalComentarios.update((total: number): number => Math.max(0, total - 1))

      if (this.totalComentarios() === 0) {
        this.paginaSeleccionada.set(1)

        return
      }

      if (this.totalComentarios() > this.comentariosDisponibles().length) {
        const respuesta: RespuestaComentarioInterface = await this.comentarioService.obtenerComentarios(
          this.publicacionService.publicacionSeleccionada()!._id,
          { disponible: true, limit: 1, offset: this.comentariosDisponibles().length }
        )

        this.comentariosDisponibles.update(
          (comentarios: ComentarioInterface[]): ComentarioInterface[] => [...comentarios, ...respuesta.comentarios]
        )
      }

      return
    }

    this.comentariosDisponibles.update((comentarios: ComentarioInterface[]): ComentarioInterface[] => comentarios
      .map((comentario: ComentarioInterface): ComentarioInterface =>
        comentario._id === comentarioModificado._id ? comentarioModificado : comentario))
  }

  protected async publicarComentario(texto: string): Promise<void> {
    const resultado: ComentarioInterface | null = await this.comentarioService
      .publicarComentario(this.publicacionService.publicacionSeleccionada()!._id, texto)

    if (resultado) {
      this.formularioComentario.limpiarFormulario()
      this.comentarioExitoso.set(true)
      this.toastService.mostrarToast("Comentario publicado correctamente", "exito")
      this.paginaSeleccionada.set(1)
      this.comentariosDisponibles.set([])
      await this.cargarComentarios()
    }
  }

  protected async seleccionarPagina(paginaSeleccionada: number): Promise<void> {
    this.paginaSeleccionada.set(paginaSeleccionada)
    await this.cargarComentarios()
  }
}