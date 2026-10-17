import { Component, inject, signal, WritableSignal } from "@angular/core"
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { SesionService } from "../../servicios/sesion-service"
import { UsuarioInterface } from "../../interfaces/usuario-interface"

@Component({
  selector: "app-registro",
  templateUrl: "./registro.html",
  styleUrl: "./registro.less",
  imports: [ReactiveFormsModule]
})
export class Registro {
  private sesionService: SesionService = inject(SesionService)
  private formBuilder: FormBuilder = inject(FormBuilder)
  private router: Router = inject(Router)

  protected imagenSeleccionada: WritableSignal<File | null> = signal<File | null>(null)
  protected mostrarModalConfirmacion: WritableSignal<boolean> = signal<boolean>(false)
  protected rutaDestino: WritableSignal<string> = signal<string>("")
  protected formularioRegistro: FormGroup = this.formBuilder.nonNullable.group({
    nombre: ["", [Validators.required, Validators.minLength(2)]],
    apellido: ["", [Validators.required, Validators.minLength(2)]],
    correo: ["", [Validators.required, Validators.email]],
    nombreUsuario: ["", [Validators.required, Validators.minLength(2)]],
    contrasenia: ["", [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)]],
    contraseniaRepetida: ["", Validators.required],
    fechaNacimiento: ["", Validators.required],
    descripcion: [""]
  }, { validators: this.validarContraseniasIguales })

  registroExitoso: WritableSignal<boolean> = signal<boolean>(false)
  confirmacionAceptada: WritableSignal<boolean> = signal<boolean>(false)

  private validarContraseniasIguales(formularioRegistro: AbstractControl): ValidationErrors | null {
    const contrasenia: string = formularioRegistro.get('contrasenia')!.value
    const contraseniaRepetida: string = formularioRegistro.get('contraseniaRepetida')!.value

    return contrasenia == contraseniaRepetida ? null : { contraseniasDistintas: true }
  }

  protected seleccionarImagen(inputFotoPerfil: HTMLInputElement): void {
    const imagenSeleccionada: File | null = inputFotoPerfil.files?.[0] ?? null

    this.imagenSeleccionada.set(imagenSeleccionada)
  }

  protected async registrarUsuario(): Promise<void> {
    if (this.formularioRegistro.valid) {
      const datosFormulario = this.formularioRegistro.getRawValue() as UsuarioInterface
      const usuarioRegistrado: UsuarioInterface | null = await this.sesionService.registrarUsuario(datosFormulario)

      if (usuarioRegistrado) {
        this.registroExitoso.set(true)
        this.router.navigate([""])
      }
    }
  }

  protected solicitarSalida(url: string): void {
    this.rutaDestino.set(url)
    this.mostrarModalConfirmacion.set(true)
  }

  protected aceptarSalida(): void {
    this.confirmacionAceptada.set(true)
    this.mostrarModalConfirmacion.set(false)
    this.router.navigate([this.rutaDestino()])
  }

  protected cancelarSalida(): void { this.mostrarModalConfirmacion.set(false) }
}