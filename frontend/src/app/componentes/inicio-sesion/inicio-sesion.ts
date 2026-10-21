import { Component, inject } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterLink } from "@angular/router"
import { AutenticacionService } from "../../servicios/autenticacion-service"
import { UsuarioInterface } from "../../interfaces/usuario-interface"
import { ToastService } from "../../servicios/toast-service"

@Component({
  selector: "app-inicio-sesion",
  templateUrl: "./inicio-sesion.html",
  styleUrl: "./inicio-sesion.less",
  imports: [ReactiveFormsModule, RouterLink]
})
export class InicioSesion {
  private sesionService: AutenticacionService = inject(AutenticacionService)
  private toastService: ToastService = inject(ToastService)
  private formBuilder: FormBuilder = inject(FormBuilder)
  private router: Router = inject(Router)

  protected formularioInicioSesion: FormGroup = this.formBuilder.nonNullable.group({
    correo: ["", Validators.required],
    contrasenia: ["", Validators.required]
  })

  protected async iniciarSesion(): Promise<void> {
    if (this.formularioInicioSesion.valid) {
      const datosFormulario: any = this.formularioInicioSesion.getRawValue()
      const usuarioAutenticado: UsuarioInterface | null = await this.sesionService.iniciarSesion(
        datosFormulario.correo, datosFormulario.contrasenia
      )

      if (usuarioAutenticado) {
        this.router.navigate([""])
        this.toastService.mostrarToast("Sesión iniciada correctamente", "exito")
      }
    } else this.toastService.mostrarToast("Campos del formulario inválidos", "error")
  }

  protected async iniciarSesionRapido(): Promise<void> {
    const usuarioAutenticado: UsuarioInterface | null = await this.sesionService.iniciarSesion(
      "santitrillo07@gmail.com",
      "Fitofilia2026"
    )

    if (usuarioAutenticado) {
      this.router.navigate([""])
      this.toastService.mostrarToast("Sesión iniciada correctamente", "exito")
    }
  }
}