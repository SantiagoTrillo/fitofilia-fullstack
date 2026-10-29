import { Component, computed, input, InputSignal, output, OutputEmitterRef, Signal } from "@angular/core"

@Component({
  selector: "app-paginacion",
  templateUrl: "./paginacion.html",
  styleUrl: "./paginacion.less"
})
export class Paginacion {
  protected paginasDisponibles: Signal<number[]> = computed((): number[] => {
    const cantidadPaginas: number = this.cantidadPaginas()
    const paginaSeleccionada: number = this.paginaActual()

    if (cantidadPaginas === 0 ) return []

    const inicioPaginado: number = Math.max(1, Math.min(paginaSeleccionada - 1, cantidadPaginas - 2))
    const finPaginado: number = Math.min(cantidadPaginas, inicioPaginado + 2)

    return Array.from({ length: finPaginado - inicioPaginado + 1 }, (_, indice: number): number => inicioPaginado + indice)
  })

  paginaActual: InputSignal<number> = input.required<number>()
  cantidadPaginas: InputSignal<number> = input.required<number>()

  paginaSeleccionada: OutputEmitterRef<number> = output<number>()
}