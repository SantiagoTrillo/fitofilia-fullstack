import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from "@angular/core"
import Chart, { ChartTypeRegistry } from "chart.js/auto"
import { EstadisticasService } from "../../../servicios/estadisticas-service"

@Component({
  selector: "app-estadisticas",
  templateUrl: "./estadisticas.html",
  styleUrl: "./estadisticas.less"
})
export class Estadisticas {
  private estadisticasService: EstadisticasService = inject(EstadisticasService)

  @ViewChild("canvasPublicaciones", { static: true }) private canvasPublicaciones!: ElementRef<HTMLCanvasElement>
  @ViewChild("canvasComentarios", { static: true }) private canvasComentarios!: ElementRef<HTMLCanvasElement>
  @ViewChild("canvasComentariosPublicacion", { static: true }) private canvasComentariosPublicacion!: ElementRef<HTMLCanvasElement>

  protected fechaDesde: WritableSignal<string> = signal<string>("")
  protected fechaHasta: WritableSignal<string> = signal<string>("")
  protected periodoValido: WritableSignal<boolean> = signal<boolean>(false)

  private crearGrafico(canvas: HTMLCanvasElement, etiquetas: string[], valores: number[], tipo: keyof ChartTypeRegistry): void {
    Chart.getChart(canvas)?.destroy()

    const colorAcento: string = getComputedStyle(document.documentElement).getPropertyValue("--te-verde").trim()
    const coloresPublicaciones: string[] = etiquetas.map((): string => `hsl(${ Math.floor(Math.random() * 360) }, 70%, 55%)`)
    const opciones: any = { responsive: false, maintainAspectRatio: false, plugins: { legend: { display: false } } }

    if (tipo !== "doughnut") opciones.scales = { x: { ticks: { autoSkip: true, maxTicksLimit: 20 } }, y: { beginAtZero: true, ticks: { precision: 0 } } }

    new Chart(canvas, {
      type: tipo,
      data: { labels: etiquetas, datasets: [{
        data: valores,
        borderColor: tipo === "doughnut" ? coloresPublicaciones : colorAcento,
        backgroundColor: tipo === "doughnut" ? coloresPublicaciones : colorAcento,
        hoverBackgroundColor: tipo === "doughnut" ? coloresPublicaciones : colorAcento,
        hoverBorderColor: tipo === "doughnut" ? coloresPublicaciones : colorAcento
      }] },
      options: opciones
    })
  }

  private async renderizarGraficos(): Promise<void> {
    if (!this.fechaDesde() || !this.fechaHasta() || this.fechaDesde() > this.fechaHasta()) {
      this.periodoValido.set(false)
      this.crearGrafico(this.canvasPublicaciones.nativeElement, [], [], "line")
      this.crearGrafico(this.canvasComentarios.nativeElement, [], [], "bar")
      this.crearGrafico(this.canvasComentariosPublicacion.nativeElement, [], [], "doughnut")
      return
    }

    const fechaDesde: string = new Date(`${ this.fechaDesde() }T00:00:00`).toISOString()
    const fechaHasta: string = new Date(`${ this.fechaHasta() }T23:59:59.999`).toISOString()
    const publicaciones = await this.estadisticasService.contarPublicacionesUsuariosPeriodo(fechaDesde, fechaHasta)
    const comentariosPorDia: { etiqueta: string; cantidad: number }[] = []
    const ultimoDia: Date = new Date(`${ this.fechaHasta() }T00:00:00Z`)

    for (let dia: Date = new Date(`${ this.fechaDesde() }T00:00:00Z`); dia <= ultimoDia; dia.setUTCDate(dia.getUTCDate() + 1)) {
      const inicioDia: string = dia.toISOString()
      const finDia: Date = new Date(dia)
      finDia.setUTCHours(23, 59, 59, 999)
      comentariosPorDia.push({
        etiqueta: dia.toLocaleDateString("es-AR", { timeZone: "UTC", day: "2-digit", month: "2-digit" }),
        cantidad: await this.estadisticasService.contarComentariosPeriodo(inicioDia, finDia.toISOString())
      })
    }

    const comentariosPorPublicacion = await this.estadisticasService.contarComentariosPublicacionesPeriodo(fechaDesde, fechaHasta)

    this.periodoValido.set(true)
    this.crearGrafico(this.canvasPublicaciones.nativeElement, publicaciones.map(dato => dato.nombreUsuario), publicaciones.map(dato => dato.cantidadPublicaciones), "line")
    this.crearGrafico(this.canvasComentarios.nativeElement, comentariosPorDia.map(dato => dato.etiqueta), comentariosPorDia.map(dato => dato.cantidad), "bar")
    this.crearGrafico(this.canvasComentariosPublicacion.nativeElement, comentariosPorPublicacion.map(dato => dato.tituloPublicacion), comentariosPorPublicacion.map(dato => dato.cantidadComentarios), "doughnut")
  }

  protected ngAfterViewInit(): void {
    this.crearGrafico(this.canvasPublicaciones.nativeElement, [], [], "line")
    this.crearGrafico(this.canvasComentarios.nativeElement, [], [], "bar")
    this.crearGrafico(this.canvasComentariosPublicacion.nativeElement, [], [], "doughnut")
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

  protected verificarPeriodoInvertido(): boolean { return Boolean(this.fechaDesde() && this.fechaHasta() && this.fechaDesde() > this.fechaHasta()) }
}