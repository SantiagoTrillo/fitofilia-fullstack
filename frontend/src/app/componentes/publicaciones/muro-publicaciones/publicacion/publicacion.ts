import { Component, inject, input, InputSignal, signal, WritableSignal } from "@angular/core"
import { PublicacionInterface } from "../../../../interfaces/publicacion-interface"
import { Router } from "@angular/router"
import { PublicacionService } from "../../../../servicios/publicacion-service"
import { AutenticacionService } from "../../../../servicios/autenticacion-service"
import { DatePipe } from "@angular/common"
import { ModalConfirmacion } from "../../../componentes-reutilizables/modal-confirmacion/modal-confirmacion"

@Component({
  selector: "app-publicacion",
  templateUrl: "./publicacion.html",
  styleUrl: "./publicacion.less",
  imports: [DatePipe, ModalConfirmacion]
})
export class Publicacion {
  private publicacionService: PublicacionService = inject(PublicacionService)
  private router: Router = inject(Router)

  protected corazonDado: WritableSignal<boolean> = signal<boolean>(false)
  protected cantidadCorazones: WritableSignal<number> = signal<number>(0)
  protected mostrarModalConfirmacion: WritableSignal<boolean> = signal<boolean>(false)

  protected autenticacionService: AutenticacionService = inject(AutenticacionService)

  publicacion: InputSignal<PublicacionInterface> = input.required<PublicacionInterface>()

  protected ngOnInit(): void {
    const publicacion: PublicacionInterface = this.publicacion()
    const idUsuario: string | undefined = this.autenticacionService.usuarioActual()?._id

    this.cantidadCorazones.set(publicacion.corazones ?? 0)
    this.corazonDado.set(!!idUsuario && (publicacion.dadoresCorazones ?? []).map(id => id.toString()).includes(idUsuario))
  }

  protected async alternarCorazon(): Promise<void> {
    const idPublicacion: string = this.publicacion()._id
    const corazonDado: boolean = this.corazonDado()

    const exito: boolean = corazonDado ? await this.publicacionService.quitarCorazon(idPublicacion)
      : await this.publicacionService.darCorazon(idPublicacion)

    if (!exito) return

    this.corazonDado.set(!corazonDado)
    this.cantidadCorazones.update(cantidad => cantidad + (corazonDado ? -1 : 1))
  }

  protected abrirPublicacion(publicacionSeleccionada: PublicacionInterface): void {
    this.publicacionService.seleccionarPublicacion(publicacionSeleccionada)
    void this.router.navigate(["/publicación"])
  }

  protected abrirModal(): void { this.mostrarModalConfirmacion.set(true) }

  protected cerrarModal(): void { this.mostrarModalConfirmacion.set(false) }

  protected async eliminarPublicacion(): Promise<void> {
    await this.publicacionService.eliminarPublicacion(this.publicacion()._id)
    this.cerrarModal()
  }
}