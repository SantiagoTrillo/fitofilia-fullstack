import { Component, inject, signal, WritableSignal } from "@angular/core"
import { Publicacion } from "./publicacion/publicacion"
import { PublicacionService } from "../../../servicios/publicacion-service"
import { PublicacionInterface } from "../../../interfaces/publicacion-interface"
import {Paginacion} from "./paginacion/paginacion";

@Component({
  selector: "app-muro-publicaciones",
  templateUrl: "./muro-publicaciones.html",
  styleUrl: "./muro-publicaciones.less",
  imports: [Publicacion, Paginacion]
})
export class MuroPublicaciones {
  private publicacionService: PublicacionService = inject(PublicacionService)

  protected publicacionesDisponibles: WritableSignal<PublicacionInterface[]> = signal<PublicacionInterface[]>([])

  protected async ngOnInit(): Promise<void> {
    this.publicacionesDisponibles.set(await this.publicacionService.obtenerPublicaciones({ orden: "fecha", disponible: true, limit: 10 }))
  }

  protected async filtrarPublicaciones(filtro: string): Promise<void> {
    this.publicacionesDisponibles.set(await this.publicacionService.obtenerPublicaciones({ orden: filtro, disponible: true, limit: 10 }))
  }
}