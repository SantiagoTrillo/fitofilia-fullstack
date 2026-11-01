import { Component, inject, input, InputSignal, output, OutputEmitterRef, signal, TemplateRef, WritableSignal } from "@angular/core"
import { DatePipe, NgTemplateOutlet } from "@angular/common"
import { ComentarioInterface } from "../../../../interfaces/comentario-interface"
import { AutenticacionService } from "../../../../servicios/autenticacion-service"
import { ComentarioService } from "../../../../servicios/comentario-service"
import { PublicacionService } from "../../../../servicios/publicacion-service"
import { ModalConfirmacion } from "../../../componentes-reutilizables/modal-confirmacion/modal-confirmacion"
import { FormularioComentario } from "../formulario-comentario/formulario-comentario"
import { ToastService } from "../../../../servicios/toast-service"

@Component({
  selector: "app-comentario",
  templateUrl: "./comentario.html",
  styleUrl: "./comentario.less",
  imports: [DatePipe, ModalConfirmacion, NgTemplateOutlet, FormularioComentario]
})
export class Comentario {
  private comentarioService: ComentarioService = inject(ComentarioService)
  private publicacionService: PublicacionService = inject(PublicacionService)
  private toastService: ToastService = inject(ToastService)

  protected plantillaSeleccionada: WritableSignal<TemplateRef<any> | null> = signal<TemplateRef<any> | null>(null)
  protected mostrarModalConfirmacion: WritableSignal<boolean> = signal<boolean>(false)

  protected autenticacionService: AutenticacionService = inject(AutenticacionService)

  comentarioExitoso: WritableSignal<boolean> = signal<boolean>(false)

  comentario: InputSignal<ComentarioInterface> = input.required<ComentarioInterface>()

  comentarioEditado: OutputEmitterRef<ComentarioInterface> = output<ComentarioInterface>()
  comentarioEliminado: OutputEmitterRef<ComentarioInterface> = output<ComentarioInterface>()

  protected abrirModal(): void { this.mostrarModalConfirmacion.set(true) }

  protected cerrarModal(): void { this.mostrarModalConfirmacion.set(false) }

  protected async editarComentario(texto: string, plantilla: TemplateRef<any>): Promise<void> {
    const resultado: ComentarioInterface | null = await this.comentarioService.editarComentario(
      this.publicacionService.publicacionSeleccionada()!._id, this.comentario()._id, texto
    )

    if (resultado) {
      this.comentarioExitoso.set(true)
      this.seleccionarPlantilla(plantilla)
      this.toastService.mostrarToast("Comentario editado correctamente", "exito")
      this.comentarioEditado.emit(resultado)
    }
  }

  protected async eliminarComentario(): Promise<void> {
    const eliminacionExitosa: boolean = await this.comentarioService.eliminarComentario(
      this.publicacionService.publicacionSeleccionada()!._id, this.comentario()._id
    )

    if (!eliminacionExitosa) return

    this.cerrarModal()
    this.comentarioEliminado.emit(this.comentario())
  }

  protected seleccionarPlantilla(plantilla: TemplateRef<any>): void { this.plantillaSeleccionada.set(plantilla) }
}