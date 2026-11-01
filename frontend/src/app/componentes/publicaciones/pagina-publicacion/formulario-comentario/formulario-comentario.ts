import { Component, inject, input, InputSignal, output, OutputEmitterRef } from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { ToastService } from "../../../../servicios/toast-service"

@Component({
  selector: "app-formulario-comentario",
  templateUrl: "./formulario-comentario.html",
  styleUrl: "./formulario-comentario.less",
  imports: [FormsModule, ReactiveFormsModule]
})
export class FormularioComentario {
  private toastService: ToastService = inject(ToastService)
  private formBuilder: FormBuilder = inject(FormBuilder)

  textoBoton: InputSignal<string> = input.required<string>()
  textoInicial: InputSignal<string | null> = input<string | null>(null)

  formularioEnviado: OutputEmitterRef<string> = output<string>()

  formularioComentario: FormGroup = this.formBuilder.nonNullable.group({
    texto: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]]
  })

  protected ngOnInit(): void {
    const textoInicial: string | null = this.textoInicial()

    if (textoInicial) this.formularioComentario.patchValue({ texto: textoInicial })
  }

  protected enviarFormulario(): void {
    if (this.formularioComentario.invalid) {
      this.formularioComentario.markAllAsTouched()
      this.toastService.mostrarToast("Comentario inválido", "error")
      return
    }

    this.formularioEnviado.emit(this.formularioComentario.getRawValue())
  }

  protected ajustarAlturaTextarea(textarea: HTMLTextAreaElement): void {
    textarea.style.height = "auto"
    textarea.style.height = `${ textarea.scrollHeight }px`
  }
}