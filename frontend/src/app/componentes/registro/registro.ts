import { Component, inject, signal, WritableSignal } from "@angular/core"
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms"
import { Router, RouterLink } from "@angular/router"
import { AutenticacionService } from "../../servicios/autenticacion-service"
import { UsuarioInterface } from "../../interfaces/usuario-interface"
import { ModalConfirmacion } from "../modal-confirmacion/modal-confirmacion"
import { ToastService } from "../../servicios/toast-service"

@Component({
  selector: "app-registro",
  templateUrl: "./registro.html",
  styleUrl: "./registro.less",
  imports: [ReactiveFormsModule, RouterLink, ModalConfirmacion]
})
export class Registro {
  private autenticacionService: AutenticacionService = inject(AutenticacionService)
  private toastService: ToastService = inject(ToastService)
  private formBuilder: FormBuilder = inject(FormBuilder)
  private router: Router = inject(Router)

  protected imagenSeleccionada: WritableSignal<File | null> = signal<File | null>(null)
  protected mostrarModalConfirmacion: WritableSignal<boolean> = signal<boolean>(false)
  protected rutaDestino: WritableSignal<string> = signal<string>("")

  registroExitoso: WritableSignal<boolean> = signal<boolean>(false)
  confirmacionAceptada: WritableSignal<boolean> = signal<boolean>(false)

  formularioRegistro: FormGroup = this.formBuilder.nonNullable.group({
    nombre: ["", [Validators.required, Validators.minLength(2)]],
    apellido: ["", [Validators.required, Validators.minLength(2)]],
    correo: ["", [Validators.required, Validators.email]],
    nombreUsuario: ["", [Validators.required, Validators.minLength(2)]],
    contrasenia: ["", [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)]],
    contraseniaRepetida: ["", Validators.required],
    fechaNacimiento: ["", Validators.required],
    descripcion: [""]
  }, { validators: this.validarContraseniasIguales })

  private validarContraseniasIguales(formularioRegistro: AbstractControl): ValidationErrors | null {
    const contrasenia: string = formularioRegistro.get('contrasenia')?.value
    const contraseniaRepetida: string = formularioRegistro.get('contraseniaRepetida')?.value

    if (!contrasenia || !contraseniaRepetida) return null

    return contrasenia === contraseniaRepetida ? null : { contraseniasDistintas: true }
  }

  protected seleccionarImagen(inputFotoPerfil: HTMLInputElement): void {
    const imagenSeleccionada: File | null = inputFotoPerfil.files?.[0] ?? null
    this.imagenSeleccionada.set(imagenSeleccionada)
  }

  protected async registrarUsuario(): Promise<void> {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched()
      this.toastService.mostrarToast("Campos del formulario inválidos", "error")
      return
    }

    const datos = this.formularioRegistro.getRawValue()
    const formData = new FormData()

    formData.append("nombre", datos.nombre)
    formData.append("apellido", datos.apellido)
    formData.append("correo", datos.correo)
    formData.append("nombreUsuario", datos.nombreUsuario)
    formData.append("contrasenia", datos.contrasenia)
    formData.append("fechaNacimiento", datos.fechaNacimiento)
    if (datos.descripcion) formData.append("descripcion", datos.descripcion)
    if (this.imagenSeleccionada()) formData.append("fotoPerfil", this.imagenSeleccionada()!)

    const usuarioRegistrado: UsuarioInterface | null = await this.autenticacionService.registrarUsuario(formData)

    if (usuarioRegistrado) {
      this.registroExitoso.set(true)
      this.toastService.mostrarToast("Registro completado correctamente", "exito")
      this.router.navigate([""])
    }
  }

  protected aceptarSalida(): void {
    this.confirmacionAceptada.set(true)
    this.mostrarModalConfirmacion.set(false)
    this.router.navigate([this.rutaDestino()])
  }

  protected cancelarSalida(): void { this.mostrarModalConfirmacion.set(false) }

  solicitarSalida(url: string): void {
    this.rutaDestino.set(url)
    this.mostrarModalConfirmacion.set(true)
  }
}