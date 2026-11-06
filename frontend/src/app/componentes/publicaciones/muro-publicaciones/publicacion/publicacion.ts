import { Component, inject, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal } from "@angular/core"
import { PublicacionInterface } from "../../../../interfaces/publicacion-interface"
import { Router } from "@angular/router"
import { PublicacionService } from "../../../../servicios/publicacion-service"
import { AutenticacionService } from "../../../../servicios/autenticacion-service"
import { DatePipe } from "@angular/common"
import { ModalConfirmacion } from "../../../componentes-reutilizables/modal-confirmacion/modal-confirmacion"
import { RespuestaComentarioInterface } from "../../../../interfaces/respuesta-comentario-interface"
import { ComentarioService } from "../../../../servicios/comentario-service"
import { ToastService } from "../../../../servicios/toast-service"

@Component({
  selector: "app-publicacion",
  templateUrl: "./publicacion.html",
  styleUrl: "./publicacion.less",
  imports: [DatePipe, ModalConfirmacion]
})
export class Publicacion {
  private publicacionService: PublicacionService = inject(PublicacionService)
  private comentarioService: ComentarioService = inject(ComentarioService)
  private toastService: ToastService = inject(ToastService)
  private router: Router = inject(Router)

  protected corazonDado: WritableSignal<boolean> = signal<boolean>(false)
  protected cantidadCorazones: WritableSignal<number> = signal<number>(0)
  protected cantidadComentarios: WritableSignal<number> = signal<number>(0)
  protected mostrarModalConfirmacion: WritableSignal<boolean> = signal<boolean>(false)

  protected autenticacionService: AutenticacionService = inject(AutenticacionService)

  publicacionExitosa: WritableSignal<boolean> = signal<boolean>(false)

  publicacion: InputSignal<PublicacionInterface> = input.required<PublicacionInterface>()
  cantidadComentariosExterna: InputSignal<number | undefined> = input<number | undefined>()

  publicacionEditada: OutputEmitterRef<PublicacionInterface> = output<PublicacionInterface>()
  publicacionEliminada: OutputEmitterRef<PublicacionInterface> = output<PublicacionInterface>()

  protected async ngOnInit(): Promise<void> {
    const publicacion: PublicacionInterface = this.publicacion()
    const idUsuario: string | undefined = this.autenticacionService.usuarioActual()?._id

    if (this.cantidadComentariosExterna() === undefined) {
      const respuesta: RespuestaComentarioInterface = await this.comentarioService.obtenerComentarios(
        this.publicacion()._id, { disponible: true }
      )

      this.cantidadComentarios.set(respuesta.total)
    }

    this.cantidadCorazones.set(publicacion.corazones ?? 0)
    this.corazonDado.set(!!idUsuario && (publicacion.dadoresCorazones ?? []).map((id: string): string => id.toString()).includes(idUsuario))
  }

  protected async editarPublicacion(formData: FormData): Promise<void> {
    const publicacionEditada : PublicacionInterface | null = await this.publicacionService.editarPublicacion(
      this.publicacion()._id, formData
    )

    if (publicacionEditada) {
      this.publicacionExitosa.set(true)
      this.toastService.mostrarToast("Publicación editada correctamente", "exito")
      this.publicacionEditada.emit(publicacionEditada)
    }
  }

  protected async alternarCorazon(): Promise<void> {
    const idPublicacion: string = this.publicacion()._id
    const corazonDado: boolean = this.corazonDado()

    const exito: boolean = corazonDado ? await this.publicacionService.quitarCorazon(idPublicacion)
      : await this.publicacionService.darCorazon(idPublicacion)

    if (!exito) return

    this.corazonDado.set(!corazonDado)
    this.cantidadCorazones.update((cantidad: number): number => cantidad + (corazonDado ? -1 : 1))
  }

  protected abrirPublicacion(publicacionSeleccionada: PublicacionInterface): void {
    this.publicacionService.seleccionarPublicacion(publicacionSeleccionada)
    void this.router.navigate(["/publicación"])
  }

  protected abrirModal(): void { this.mostrarModalConfirmacion.set(true) }

  protected cerrarModal(): void { this.mostrarModalConfirmacion.set(false) }

  protected async eliminarPublicacion(): Promise<void> {
    const eliminacionExitosa: boolean = await this.publicacionService.eliminarPublicacion(this.publicacion()._id)

    if (!eliminacionExitosa) return

    this.cerrarModal()
    this.publicacionEliminada.emit(this.publicacion())
  }
}