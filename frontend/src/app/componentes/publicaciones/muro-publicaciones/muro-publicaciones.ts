import { Component, computed, inject, Signal, signal, WritableSignal } from "@angular/core"
import { Publicacion } from "./publicacion/publicacion"
import { PublicacionService } from "../../../servicios/publicacion-service"
import { PublicacionInterface } from "../../../interfaces/publicacion-interface"
import { Paginacion } from "./paginacion/paginacion"
import { RespuestaPublicacionInterface } from "../../../interfaces/respuesta-publicacion-interface"

@Component({
  selector: "app-muro-publicaciones",
  templateUrl: "./muro-publicaciones.html",
  styleUrl: "./muro-publicaciones.less",
  imports: [Publicacion, Paginacion]
})
export class MuroPublicaciones {
  private publicacionesPagina: Signal<number> = signal<number>(10)

  private publicacionService: PublicacionService = inject(PublicacionService)

  protected publicacionesDisponibles: WritableSignal<PublicacionInterface[]> = signal<PublicacionInterface[]>([])
  protected totalPublicaciones: WritableSignal<number> = signal<number>(0)
  protected paginaSeleccionada: WritableSignal<number> = signal<number>(1)
  protected cantidadPaginas: Signal<number> = computed((): number => Math.ceil(this.totalPublicaciones() / this.publicacionesPagina()))
  protected ordenSeleccionado: WritableSignal<string> = signal<string>("fecha")

  private async cargarPublicaciones(): Promise<void> {
    const respuesta: RespuestaPublicacionInterface = await this.publicacionService.obtenerPublicaciones({
      orden: this.ordenSeleccionado(),
      disponible: true,
      limit: this.publicacionesPagina(),
      offset: (this.paginaSeleccionada() - 1) * this.publicacionesPagina()
    })
    const ultimaPagina: number = Math.max(1, Math.ceil(respuesta.total / this.publicacionesPagina()))

    if (this.paginaSeleccionada() > ultimaPagina) return this.seleccionarPagina(ultimaPagina)

    this.publicacionesDisponibles.set(respuesta.publicaciones)
    this.totalPublicaciones.set(respuesta.total)
  }

  protected async ngOnInit(): Promise<void> { await this.cargarPublicaciones() }

  protected async ordenarPublicaciones(orden: string): Promise<void> {
    this.ordenSeleccionado.set(orden)
    this.paginaSeleccionada.set(1)
    await this.cargarPublicaciones()
  }

  protected async actualizarPublicaciones(idPublicacionBorrada: string): Promise<void> {
    this.publicacionesDisponibles.update(
      (publicaciones: PublicacionInterface[]): PublicacionInterface[] =>
        publicaciones.filter((publicacion: PublicacionInterface): boolean => publicacion._id !== idPublicacionBorrada)
    )
    this.totalPublicaciones.update((total: number): number => Math.max(0, total - 1))

    const ultimaPagina: number = Math.max(1, this.cantidadPaginas())

    if (this.paginaSeleccionada() > ultimaPagina) await this.seleccionarPagina(ultimaPagina)
  }

  protected async seleccionarPagina(paginaSeleccionada: number): Promise<void> {
    this.paginaSeleccionada.set(paginaSeleccionada)
    await this.cargarPublicaciones()
  }
}