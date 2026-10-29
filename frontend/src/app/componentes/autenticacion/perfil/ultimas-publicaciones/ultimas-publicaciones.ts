import { Component, inject, signal, WritableSignal } from "@angular/core"
import { PublicacionService } from "../../../../servicios/publicacion-service"
import { PublicacionInterface } from "../../../../interfaces/publicacion-interface"
import { Publicacion } from "../../../publicaciones/muro-publicaciones/publicacion/publicacion"
import { AutenticacionService } from "../../../../servicios/autenticacion-service"
import { RespuestaPublicacionInterface } from "../../../../interfaces/respuesta-publicacion-interface"

@Component({
  selector: "app-ultimas-publicaciones",
  templateUrl: "./ultimas-publicaciones.html",
  styleUrl: "./ultimas-publicaciones.less",
  imports: [Publicacion]
})
export class UltimasPublicaciones {
  private publicacionService: PublicacionService = inject(PublicacionService)
  private autenticacionService: AutenticacionService = inject(AutenticacionService)

  protected publicacionesRecientes: WritableSignal<PublicacionInterface[]> = signal<PublicacionInterface[]>([])

  protected async ngOnInit(): Promise<void> { await this.cargarPublicacionesRecientes() }

  protected async cargarPublicacionesRecientes(): Promise<void> {
    const respuesta: RespuestaPublicacionInterface = await this.publicacionService
      .obtenerPublicaciones({ orden: "fecha", disponible: true, autor: this.autenticacionService.usuarioActual()?._id,limit: 3 })

    this.publicacionesRecientes.set(respuesta.publicaciones)
  }
}