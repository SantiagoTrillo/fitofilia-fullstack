import { Component, inject } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterLink } from "@angular/router"
import { SesionService } from "../../servicios/sesion-service"
import { UsuarioInterface } from "../../interfaces/usuario-interface"

@Component({
  selector: "app-inicio-sesion",
  templateUrl: "./inicio-sesion.html",
  styleUrl: "./inicio-sesion.less",
  imports: [ReactiveFormsModule, RouterLink]
})
export class InicioSesion {
  private sesionService: SesionService = inject(SesionService)
  private formBuilder: FormBuilder = inject(FormBuilder)
  private router: Router = inject(Router)

  protected formularioInicioSesion: FormGroup = this.formBuilder.nonNullable.group({
    correo: ["", Validators.required],
    contrasenia: ["", Validators.required]
  })

  async iniciarSesion(): Promise<void> {
    if (this.formularioInicioSesion.valid) {
      const datosFormulario: any = this.formularioInicioSesion.getRawValue()
      const usuarioAutenticado: UsuarioInterface | null = await this.sesionService.iniciarSesion(
        datosFormulario.correo_electronico, datosFormulario.contrasenia
      )

      if (usuarioAutenticado) this.router.navigate([""])
    }
  }
}