import { Component, output, OutputEmitterRef, signal, Signal } from "@angular/core"

@Component({
  selector: "app-paginacion",
  templateUrl: "./paginacion.html",
  styleUrl: "./paginacion.less"
})
export class Paginacion {
  protected cantidadPaginas: Signal<number[]> = signal<number[]>([1, 2, 3])

  readonly paginaSeleccionada: OutputEmitterRef<number> = output<number>()
}