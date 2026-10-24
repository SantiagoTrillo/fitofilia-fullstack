import { Component, inject, input, InputSignal, OnInit, output, OutputEmitterRef, signal, WritableSignal } from "@angular/core"
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms"
import { RouterLink } from "@angular/router"
import { UsuarioInterface } from "../../../interfaces/usuario-interface"
import { ToastService } from "../../../servicios/toast-service"

@Component({
  selector: "app-formulario-usuario",
  templateUrl: "./formulario-usuario.html",
  styleUrl: "./formulario-usuario.less",
  imports: [ReactiveFormsModule, RouterLink]
})
export class FormularioUsuario implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder)
  private toastService: ToastService = inject(ToastService)

  protected imagenSeleccionada: WritableSignal<File | null> = signal<File | null>(null)

  titulo: InputSignal<string> = input.required<string>()
  textoBotonPrimario: InputSignal<string> = input.required<string>()
  textoBotonSecundario: InputSignal<string> = input.required<string>()
  rutaBotonSecundario: InputSignal<string> = input.required<string>()
  tipoFormulario: InputSignal<string> = input.required<string>()
  datosIniciales: InputSignal<UsuarioInterface | null> = input<UsuarioInterface | null>(null)

  guardar: OutputEmitterRef<FormData> = output<FormData>()
  formularioModificado: OutputEmitterRef<boolean> = output<boolean>()

  formulario: FormGroup = this.formBuilder.nonNullable.group({
    nombre: ["", [Validators.required, Validators.minLength(2)]],
    apellido: ["", [Validators.required, Validators.minLength(2)]],
    correo: ["", [Validators.required, Validators.email]],
    nombreUsuario: ["", [Validators.required, Validators.minLength(2)]],
    contrasenia: ["", [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)]],
    contraseniaRepetida: ["", Validators.required],
    fechaNacimiento: ["", Validators.required],
    descripcion: [""],
    titulo: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    cuerpo: ["", [Validators.maxLength(1000)]]
  }, { validators: this.validarContraseniasIguales })

  ngOnInit(): void {
    this.formulario.valueChanges.subscribe(_ => this.formularioModificado.emit(this.formulario.dirty))

    if (this.tipoFormulario() === "creacionPublicacion") {
      this.formulario.get("nombre")?.clearValidators()
      this.formulario.get("apellido")?.clearValidators()
      this.formulario.get("correo")?.clearValidators()
      this.formulario.get("nombreUsuario")?.clearValidators()
      this.formulario.get("contrasenia")?.clearValidators()
      this.formulario.get("contraseniaRepetida")?.clearValidators()
      this.formulario.get("fechaNacimiento")?.clearValidators()

      this.formulario.get("nombre")?.updateValueAndValidity()
      this.formulario.get("apellido")?.updateValueAndValidity()
      this.formulario.get("correo")?.updateValueAndValidity()
      this.formulario.get("nombreUsuario")?.updateValueAndValidity()
      this.formulario.get("contrasenia")?.updateValueAndValidity()
      this.formulario.get("contraseniaRepetida")?.updateValueAndValidity()
      this.formulario.get("fechaNacimiento")?.updateValueAndValidity()
    } else {
      this.formulario.get("titulo")?.clearValidators()
      this.formulario.get("cuerpo")?.clearValidators()
      this.formulario.get("titulo")?.updateValueAndValidity()
      this.formulario.get("cuerpo")?.updateValueAndValidity()

      if (this.tipoFormulario() !== "registro") {
        this.formulario.get("contrasenia")?.clearValidators()
        this.formulario.get("contraseniaRepetida")?.clearValidators()
        this.formulario.get("contrasenia")?.updateValueAndValidity()
        this.formulario.get("contraseniaRepetida")?.updateValueAndValidity()
      }
    }

    const datosIniciales: UsuarioInterface | null = this.datosIniciales()

    if (datosIniciales) {
      const fechaNacimiento: string = new Date(datosIniciales.fechaNacimiento).toISOString().split("T")[0]

      this.formulario.patchValue({
        nombre: datosIniciales.nombre,
        apellido: datosIniciales.apellido,
        correo: datosIniciales.correo,
        nombreUsuario: datosIniciales.nombreUsuario,
        fechaNacimiento: fechaNacimiento,
        descripcion: datosIniciales.descripcion
      })
    }
  }

  private validarContraseniasIguales(formulario: AbstractControl): ValidationErrors | null {
    const contrasenia: string = formulario.get("contrasenia")?.value
    const contraseniaRepetida: string = formulario.get("contraseniaRepetida")?.value

    if (!contrasenia && !contraseniaRepetida) return null
    if (!contrasenia || !contraseniaRepetida) return null

    return contrasenia === contraseniaRepetida ? null : { contraseniasDistintas: true }
  }

  protected seleccionarImagen(inputFotoPerfil: HTMLInputElement): void {
    const imagen: File | null = inputFotoPerfil.files?.[0] ?? null

    this.imagenSeleccionada.set(imagen)
    this.formulario.markAsDirty()
    this.formularioModificado.emit(true)
  }

  protected ajustarAlturaTextarea(textarea: HTMLTextAreaElement): void {
    textarea.style.height = "auto"
    textarea.style.height = `${ textarea.scrollHeight }px`
  }

  protected enviarFormulario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched()
      this.toastService.mostrarToast("Campos del formulario inválidos", "error")
      return
    }

    const datosFormulario: any = this.formulario.getRawValue()
    const formData = new FormData()

    if (this.tipoFormulario() === "creacionPublicacion") {
      formData.append("titulo", datosFormulario.titulo)
      if (datosFormulario.cuerpo) formData.append("cuerpo", datosFormulario.cuerpo)
      const imagen: File | null = this.imagenSeleccionada()
      if (imagen) formData.append("imagen", imagen)
      this.guardar.emit(formData)
      return
    }

    formData.append("nombre", datosFormulario.nombre)
    formData.append("apellido", datosFormulario.apellido)
    formData.append("correo", datosFormulario.correo)
    formData.append("nombreUsuario", datosFormulario.nombreUsuario)

    if (datosFormulario.contrasenia) formData.append("contrasenia", datosFormulario.contrasenia)

    formData.append("fechaNacimiento", datosFormulario.fechaNacimiento)

    if (datosFormulario.descripcion) formData.append("descripcion", datosFormulario.descripcion)

    const imagen: File | null = this.imagenSeleccionada()

    if (imagen) formData.append("fotoPerfil", imagen)

    this.guardar.emit(formData)
  }
}