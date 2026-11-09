import { Component, input, InputSignal, output, OutputEmitterRef } from "@angular/core"
import { CerrarModalClickFondoDirective } from "../../../directivas/cerrar-modal-click-fondo-directive"

@Component({
  selector: "app-modal-confirmacion",
  templateUrl: "./modal-confirmacion.html",
  styleUrl: "./modal-confirmacion.less",
  imports: [CerrarModalClickFondoDirective]
})
export class ModalConfirmacion {
  titulo: InputSignal<string> = input<string>("Confirmación")
  mensaje: InputSignal<string> = input<string>("")

  confirmar: OutputEmitterRef<void> = output<void>()
  cancelar: OutputEmitterRef<void> = output<void>()

  protected confirmarAccion(): void { this.confirmar.emit() }

  protected cancelarAccion(): void { this.cancelar.emit() }
}