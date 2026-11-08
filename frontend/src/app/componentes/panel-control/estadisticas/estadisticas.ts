import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from "@angular/core"
import Chart, { ChartTypeRegistry } from "chart.js/auto"
import { PublicacionInterface } from "../../../interfaces/publicacion-interface"
import { EstadisticasService } from "../../../servicios/estadisticas-service"
import { PublicacionService } from "../../../servicios/publicacion-service"
import { RespuestaPublicacionInterface } from "../../../interfaces/respuesta-publicacion-interface"

@Component({
  selector: "app-estadisticas",
  templateUrl: "./estadisticas.html",
  styleUrl: "./estadisticas.less"
})
export class Estadisticas {
  private publicacionesService: PublicacionService = inject(PublicacionService)
  private estadisticasService: EstadisticasService = inject(EstadisticasService)

  @ViewChild("canvasPublicaciones", { static: true }) private canvasPublicaciones!: ElementRef<HTMLCanvasElement>
  @ViewChild("canvasComentarios", { static: true }) private canvasComentarios!: ElementRef<HTMLCanvasElement>
  @ViewChild("canvasComentariosPublicacion", { static: true }) private canvasComentariosPublicacion!: ElementRef<HTMLCanvasElement>

  protected publicacionesPublicadas: WritableSignal<PublicacionInterface[]> = signal<PublicacionInterface[]>([])
  protected fechaDesde: WritableSignal<string> = signal<string>("")
  protected fechaHasta: WritableSignal<string> = signal<string>("")
  protected idPublicacion: WritableSignal<string> = signal<string>("")
  protected periodoValido: WritableSignal<boolean> = signal<boolean>(false)

  private async contarRecursosPeriodo(tipo: string, fechaDesde: string, fechaHasta: string): Promise<number> {
    const inicioPeriodo: string = new Date(`${ fechaDesde }T00:00:00Z`).toISOString()
    const finPeriodo: string = new Date(`${ fechaHasta }T23:59:59.999Z`).toISOString()

    if (tipo === "publicaciones") return this.estadisticasService.contarPublicacionesPeriodo(inicioPeriodo, finPeriodo)
    if (tipo === "comentarios") return this.estadisticasService.contarComentariosPeriodo(inicioPeriodo, finPeriodo)

    return this.estadisticasService.contarComentariosPublicacionPeriodo(this.idPublicacion(), inicioPeriodo, finPeriodo)
  }

  private crearGrafico(canvas: HTMLCanvasElement, datos: any[], tipo: keyof ChartTypeRegistry): Chart {
    Chart.getChart(canvas)?.destroy()

    const colorAcento: string = getComputedStyle(document.documentElement).getPropertyValue("--te-verde").trim()

    Chart.defaults.color = colorAcento

    return new Chart(canvas, {
      type: tipo,
      data: {
        labels: datos.map((punto: any): any => punto.etiqueta), datasets: [{
          data: tipo === "scatter" ? datos.map((punto: any, indice: number): any => ({ x: indice, y: punto.valor })) : datos.map((punto: any): any => punto.valor),
          borderColor: colorAcento,
          backgroundColor: colorAcento,
          showLine: tipo !== "scatter",
          pointRadius: tipo === "scatter" ? 5 : undefined
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: tipo === "scatter" ? {
          x: { type: "linear", min: 0, max: Math.max(1, datos.length - 1), ticks: { stepSize: 1, callback: (valor: string | number): string => datos[Number(valor)]?.etiqueta ?? "" } },
          y: { beginAtZero: true, ticks: { precision: 0 } }
        } : { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    })
  }

  private async renderizarGraficos(): Promise<void> {
    if (!this.fechaDesde() || !this.fechaHasta() || this.fechaDesde() > this.fechaHasta()) {
      this.periodoValido.set(false)

      this.crearGrafico(this.canvasPublicaciones.nativeElement, [], "line")
      this.crearGrafico(this.canvasComentarios.nativeElement, [], "bar")
      this.crearGrafico(this.canvasComentariosPublicacion.nativeElement, [], "scatter")

      return
    }

    const inicioPeriodo: Date = new Date(`${ this.fechaDesde() }T00:00:00Z`)
    const finPeriodo: Date = new Date(`${ this.fechaHasta() }T00:00:00Z`)
    const dias: number = (finPeriodo.getTime() - inicioPeriodo.getTime()) / 86400000 + 1
    const salto: number = dias > 120 ? 30 : dias > 31 ? 7 : 1
    const periodos: any[] = []

    for (let fecha: Date = new Date(inicioPeriodo); fecha <= finPeriodo;) {
      const fin: Date = new Date(fecha)

      fin.setUTCDate(fin.getUTCDate() + salto - 1)

      if (fin > finPeriodo) fin.setTime(finPeriodo.getTime())

      periodos.push(
        { fechaDesde: fecha.toISOString().slice(0, 10), fechaHasta: fin.toISOString().slice(0, 10),
          etiqueta: fecha.toLocaleDateString("es-AR", { timeZone: "UTC", day: "2-digit", month: "2-digit" }) }
      )

      fecha = new Date(fin)

      fecha.setUTCDate(fecha.getUTCDate() + 1)
    }
    const datos = await Promise.all(periodos.map(async periodo => ({
      etiqueta: periodo.etiqueta,
      publicaciones: await this.contarRecursosPeriodo("publicaciones", periodo.fechaDesde, periodo.fechaHasta),
      comentarios: await this.contarRecursosPeriodo("comentarios", periodo.fechaDesde, periodo.fechaHasta),
      comentariosPublicacion: this.idPublicacion()
        ? await this.contarRecursosPeriodo("comentariosPublicacion", periodo.fechaDesde, periodo.fechaHasta) : 0
    })))

    this.periodoValido.set(true)

    this.crearGrafico(this.canvasPublicaciones.nativeElement, datos.map(punto =>
      ({ etiqueta: punto.etiqueta, valor: punto.publicaciones })), "line")
    this.crearGrafico(this.canvasComentarios.nativeElement, datos.map(punto =>
      ({ etiqueta: punto.etiqueta, valor: punto.comentarios })), "bar")
    this.crearGrafico(this.canvasComentariosPublicacion.nativeElement, datos.map(punto =>
      ({ etiqueta: punto.etiqueta, valor: punto.comentariosPublicacion })), "scatter")
  }

  protected async ngOnInit(): Promise<void> {
    const respuesta: RespuestaPublicacionInterface = await this.publicacionesService.obtenerPublicaciones({})
    this.publicacionesPublicadas.set(respuesta.publicaciones
      .sort((primeraPublicacion: PublicacionInterface, segundaPublicacion: PublicacionInterface): number =>
        primeraPublicacion.titulo.localeCompare(segundaPublicacion.titulo, "es", { sensitivity: "base" })))
  }

  protected ngAfterViewInit(): void {
    this.crearGrafico(this.canvasPublicaciones.nativeElement, [], "line")
    this.crearGrafico(this.canvasComentarios.nativeElement, [], "bar")
    this.crearGrafico(this.canvasComentariosPublicacion.nativeElement, [], "scatter")
  }

  protected ngOnDestroy(): void {
    Chart.getChart(this.canvasPublicaciones.nativeElement)?.destroy()
    Chart.getChart(this.canvasComentarios.nativeElement)?.destroy()
    Chart.getChart(this.canvasComentariosPublicacion.nativeElement)?.destroy()
  }

  protected async seleccionarFechaDesde(evento: Event): Promise<void> {
    this.fechaDesde.set((evento.target as HTMLInputElement).value)

    await this.renderizarGraficos()
  }

  protected async seleccionarFechaHasta(evento: Event): Promise<void> {
    this.fechaHasta.set((evento.target as HTMLInputElement).value)

    await this.renderizarGraficos()
  }

  protected async seleccionarPublicacion(evento: Event): Promise<void> {
    this.idPublicacion.set((evento.target as HTMLSelectElement).value)

    await this.renderizarGraficos()
  }

  protected verificarPeriodoInvertido(): boolean { return Boolean(this.fechaDesde() && this.fechaHasta() && this.fechaDesde() > this.fechaHasta()) }
}
