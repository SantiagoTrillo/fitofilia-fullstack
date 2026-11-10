import { Component, inject, signal, WritableSignal } from "@angular/core"
import { UsuarioInterface } from "../../../../interfaces/usuario-interface"
import { ToastService } from "../../../../servicios/toast-service"
import { UsuarioService } from "../../../../servicios/usuario-service"
import { InicialesUsuarioPipe } from "../../../../tuberias/iniciales-usuario-pipe"
import { CreacionUsuarios } from "../creacion-usuarios/creacion-usuarios"

@Component({
  selector: "app-listado-usuarios",
  templateUrl: "./listado-usuarios.html",
  styleUrl: "./listado-usuarios.less",
  imports: [CreacionUsuarios, InicialesUsuarioPipe]
})
export class ListadoUsuarios {
  private usuariosService: UsuarioService = inject(UsuarioService)
  private toastService: ToastService = inject(ToastService)

  protected usuariosRegistrados: WritableSignal<UsuarioInterface[]> = signal<UsuarioInterface[]>([])
  protected usuarioActualizando: WritableSignal<string | null> = signal<string | null>(null)

  protected ngOnInit(): void { void this.cargarUsuarios() }

  protected async cargarUsuarios(): Promise<void> { this.usuariosRegistrados.set(await this.usuariosService.buscarTodos()) }

  protected agregarUsuario(usuario: UsuarioInterface): void {
    this.usuariosRegistrados.update((usuarios: UsuarioInterface[]): UsuarioInterface[] => [usuario, ...usuarios])
  }

  protected async cambiarDisponibilidad(usuario: UsuarioInterface): Promise<void> {
    if (this.usuarioActualizando()) return

    this.usuarioActualizando.set(usuario._id)
    this.usuariosRegistrados.update((usuarios: UsuarioInterface[]): UsuarioInterface[] =>
      usuarios.map((usuarioListado: UsuarioInterface): UsuarioInterface =>
        usuarioListado._id === usuario._id ? { ...usuarioListado, disponible: !usuario.disponible } : usuarioListado))

    const actualizacionExitosa: boolean = await this.usuariosService.cambiarDisponibilidad(usuario)

    if (!actualizacionExitosa) {
      this.usuariosRegistrados.update((usuarios: UsuarioInterface[]): UsuarioInterface[] =>
        usuarios.map((usuarioListado: UsuarioInterface): UsuarioInterface =>
          usuarioListado._id === usuario._id ? { ...usuarioListado, disponible: usuario.disponible } : usuarioListado))
    } else this.toastService.mostrarToast(usuario.disponible ? "Usuario deshabilitado" : "Usuario habilitado", "exito")

    this.usuarioActualizando.set(null)
  }
}