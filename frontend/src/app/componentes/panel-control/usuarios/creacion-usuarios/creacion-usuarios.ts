import { Component, inject, output, OutputEmitterRef } from "@angular/core"
import { UsuarioInterface } from "../../../../interfaces/usuario-interface"
import { UsuarioService } from "../../../../servicios/usuario-service"
import { FormularioUsuario } from "../../../componentes-reutilizables/formulario-usuario/formulario-usuario"

@Component({
  selector: "app-creacion-usuarios",
  templateUrl: "./creacion-usuarios.html",
  styleUrl: "./creacion-usuarios.less",
  imports: [FormularioUsuario]
})
export class CreacionUsuarios {
  private usuariosService: UsuarioService = inject(UsuarioService)

  protected async crearUsuario(formData: FormData): Promise<void> {
    const usuarioCreado: UsuarioInterface | null = await this.usuariosService.crear(formData)

    if (usuarioCreado) this.usuarioCreado.emit(usuarioCreado)
  }

  usuarioCreado: OutputEmitterRef<UsuarioInterface> = output<UsuarioInterface>()
}