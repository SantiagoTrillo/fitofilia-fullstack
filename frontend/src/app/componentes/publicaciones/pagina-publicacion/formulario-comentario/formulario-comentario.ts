import { AfterViewInit, Component, ElementRef, inject, input, InputSignal, output, OutputEmitterRef, ViewChild } from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { ToastService } from "../../../../servicios/toast-service"

@Component({
  selector: "app-formulario-comentario",
  templateUrl: "./formulario-comentario.html",
  styleUrl: "./formulario-comentario.less",
  imports: [FormsModule, ReactiveFormsModule]
})
export class FormularioComentario implements AfterViewInit {
  private toastService: ToastService = inject(ToastService)
  private formBuilder: FormBuilder = inject(FormBuilder)

  @ViewChild("textareaTexto") private textareaTexto!: ElementRef<HTMLTextAreaElement>

  protected envioIntentado: boolean = false

  textoBoton: InputSignal<string> = input.required<string>()
  textoInicial: InputSignal<string | null> = input<string | null>(null)
  edicionCancelada: OutputEmitterRef<void> = output<void>()
  formularioEnviado: OutputEmitterRef<string> = output<string>()

  formularioComentario: FormGroup = this.formBuilder.nonNullable.group({
    texto: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]]
  })

  protected ngOnInit(): void {
    const textoInicial: string | null = this.textoInicial()

    if (textoInicial) this.formularioComentario.patchValue({ texto: textoInicial })
  }

  protected enviarFormulario(): void {
    this.envioIntentado = true

    if (this.formularioComentario.invalid) {
      this.formularioComentario.markAllAsTouched()
      this.toastService.mostrarToast("Comentario inválido", "error")

      return
    }

    this.formularioEnviado.emit(this.formularioComentario.getRawValue().texto)
    this.envioIntentado = false
  }

  limpiarFormulario(): void {
    this.formularioComentario.reset()
    this.textareaTexto.nativeElement.style.height = "auto"
    this.envioIntentado = false
  }

  protected ajustarAlturaTextarea(): void {
    this.textareaTexto.nativeElement.style.height = "auto"
    this.textareaTexto.nativeElement.style.height = `${ this.textareaTexto.nativeElement.scrollHeight }px`
  }

  ngAfterViewInit(): void { this.ajustarAlturaTextarea() }

}