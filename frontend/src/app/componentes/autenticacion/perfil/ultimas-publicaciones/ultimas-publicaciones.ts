import { Component, inject, signal, WritableSignal } from "@angular/core"
import { PublicacionService } from "../../../../servicios/publicacion-service"
import { PublicacionInterface } from "../../../../interfaces/publicacion-interface"
import { Publicacion } from "../../../publicaciones/muro-publicaciones/publicacion/publicacion"
import { AutenticacionService } from "../../../../servicios/autenticacion-service"

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

  protected async ngOnInit(): Promise<void> {
    this.publicacionesRecientes.set(await this.publicacionService
      .obtenerPublicaciones({ orden: "fecha", disponible: true, autor: this.autenticacionService.usuarioActual()?._id,limit: 3 }))
  }
}