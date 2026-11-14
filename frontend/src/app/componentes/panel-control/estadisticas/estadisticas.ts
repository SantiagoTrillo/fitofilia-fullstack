import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from "@angular/core"
import Chart, { ChartTypeRegistry } from "chart.js/auto"
import { EstadisticasService } from "../../../servicios/estadisticas-service"
import { ToastService } from "../../../servicios/toast-service"
import { PaginaCargando } from "../../pagina-cargando/pagina-cargando"

@Component({
  selector: "app-estadisticas",
  templateUrl: "./estadisticas.html",
  styleUrl: "./estadisticas.less",
  imports: [PaginaCargando]
})
export class Estadisticas {
  private estadisticasService: EstadisticasService = inject(EstadisticasService)
  private toastService: ToastService = inject(ToastService)
  @ViewChild("canvasPublicaciones", { static: true }) private canvasPublicaciones!: ElementRef<HTMLCanvasElement>
  @ViewChild("canvasComentarios", { static: true }) private canvasComentarios!: ElementRef<HTMLCanvasElement>
  @ViewChild("canvasComentariosPublicacion", { static: true }) private canvasComentariosPublicacion!: ElementRef<HTMLCanvasElement>

  protected fechaDesde: WritableSignal<string> = signal<string>("")
  protected fechaHasta: WritableSignal<string> = signal<string>("")
  protected periodoValido: WritableSignal<boolean> = signal<boolean>(false)
  protected cargando: WritableSignal<boolean> = signal<boolean>(false)

  private crearGrafico(canvas: HTMLCanvasElement, etiquetas: string[], valores: number[], tipo: keyof ChartTypeRegistry): void {
    Chart.getChart(canvas)?.destroy()

    const colorAcento: string = getComputedStyle(document.documentElement).getPropertyValue("--te-verde").trim()
    const coloresAleatorios: string[] = etiquetas.map((): string => `hsl(${ Math.floor(Math.random() * 360) }, 70%, 55%)`)
    const opciones: any = { responsive: false, maintainAspectRatio: false, plugins: { legend: { display: false } } }

    if (tipo !== "doughnut") {
      opciones.scales = { x: { ticks: { autoSkip: true, maxTicksLimit: 20 } }, y: { beginAtZero: true, ticks: { precision: 0 } } }
    }

    new Chart(canvas, {
      type: tipo,
      data: { labels: etiquetas, datasets: [{
        data: valores,
        borderColor: tipo === "doughnut" ? coloresAleatorios : colorAcento,
        backgroundColor: tipo === "doughnut" ? coloresAleatorios : colorAcento,
        hoverBackgroundColor: tipo === "doughnut" ? coloresAleatorios : colorAcento,
        hoverBorderColor: tipo === "doughnut" ? coloresAleatorios : colorAcento
      }] },
      options: opciones
    })
  }

  private destruirGraficos(): void {
    Chart.getChart(this.canvasPublicaciones.nativeElement)?.destroy()
    Chart.getChart(this.canvasComentarios.nativeElement)?.destroy()
    Chart.getChart(this.canvasComentariosPublicacion.nativeElement)?.destroy()
  }

  private async renderizarGraficos(): Promise<void> {
    const fechaDesdeSeleccionada: string = this.fechaDesde()
    const fechaHastaSeleccionada: string = this.fechaHasta()

    this.periodoValido.set(false)

    if (!fechaDesdeSeleccionada || !fechaHastaSeleccionada || fechaDesdeSeleccionada > fechaHastaSeleccionada) {
      this.cargando.set(false)

      this.destruirGraficos()

      return
    }

    this.destruirGraficos()

    this.cargando.set(true)

    try {
      const fechaDesde: string = new Date(`${ fechaDesdeSeleccionada }T00:00:00`).toISOString()
      const fechaHasta: string = new Date(`${ fechaHastaSeleccionada }T23:59:59.999`).toISOString()
      const publicaciones: { nombreUsuario: string, cantidadPublicaciones: number }[] = await this.estadisticasService
        .contarPublicacionesUsuariosPeriodo(fechaDesde, fechaHasta)
      const comentariosDia: { etiqueta: string; cantidad: number }[] = []
      const ultimoDia: Date = new Date(`${ fechaHastaSeleccionada }T00:00:00Z`)

      for (let dia: Date = new Date(`${ fechaDesdeSeleccionada }T00:00:00Z`); dia <= ultimoDia; dia.setUTCDate(dia.getUTCDate() + 1)) {
        const inicioDia: string = dia.toISOString()
        const finDia: Date = new Date(dia)

        finDia.setUTCHours(23, 59, 59, 999)

        comentariosDia.push({
          etiqueta: dia.toLocaleDateString("es-AR", { timeZone: "UTC", day: "2-digit", month: "2-digit" }),
          cantidad: await this.estadisticasService.contarComentariosPeriodo(inicioDia, finDia.toISOString())
        })
      }

      const comentariosPublicacion: { tituloPublicacion: string, cantidadComentarios: number }[] = await this.estadisticasService
        .contarComentariosPublicacionesPeriodo(fechaDesde, fechaHasta)

      this.crearGrafico(
        this.canvasPublicaciones.nativeElement,
        publicaciones.map((objeto: { nombreUsuario: string, cantidadPublicaciones: number }): string => objeto.nombreUsuario),
        publicaciones.map((objeto: { nombreUsuario: string, cantidadPublicaciones: number }): number => objeto.cantidadPublicaciones),
        "line"
      )
      this.crearGrafico(
        this.canvasComentarios.nativeElement,
        comentariosDia.map((objeto: { etiqueta: string, cantidad: number }): string => objeto.etiqueta),
        comentariosDia.map((objeto: { etiqueta: string, cantidad: number }): number => objeto.cantidad), "bar")
      this.crearGrafico(
        this.canvasComentariosPublicacion.nativeElement,
        comentariosPublicacion.map((objeto: { tituloPublicacion: string, cantidadComentarios: number }): string => objeto.tituloPublicacion),
        comentariosPublicacion.map((objeto: { tituloPublicacion: string, cantidadComentarios: number }): number => objeto.cantidadComentarios),
        "doughnut"
      )
      this.periodoValido.set(true)
    } catch (error: any) {
      this.toastService.mostrarToast(
        `No se pudieron cargar las estadísticas: ${ error.error?.message || error.message || "Error inesperado" }`, "error"
      )
    } finally { this.cargando.set(false) }
  }

  protected ngAfterViewInit(): void {
    this.destruirGraficos()

    const hoy: Date = new Date()
    const fechaHoy: string = `${ hoy.getFullYear() }-${ String(hoy.getMonth() + 1).padStart(2, "0") }-${ String(hoy.getDate()).padStart(2, "0") }`

    this.fechaDesde.set(fechaHoy)
    this.fechaHasta.set(fechaHoy)

    void this.renderizarGraficos()
  }

  protected ngOnDestroy(): void { this.destruirGraficos() }

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