import { Component, inject, signal, WritableSignal } from "@angular/core"
import { PublicacionService } from "../../../servicios/publicacion-service"
import { Publicacion } from "../muro-publicaciones/publicacion/publicacion"
import { BotonVolver } from "../../componentes-reutilizables/boton-volver/boton-volver"
import { Comentario } from "./comentario/comentario"
import { ComentarioInterface } from "../../../interfaces/comentario-interface"

@Component({
  selector: "app-pagina-publicacion",
  templateUrl: "./pagina-publicacion.html",
  styleUrl: "./pagina-publicacion.less",
  imports: [Publicacion, BotonVolver, Comentario]
})
export class PaginaPublicacion {
  protected comentariosDisponibles: WritableSignal<ComentarioInterface[]> = signal<ComentarioInterface[]>([])

  protected publicacionService: PublicacionService = inject(PublicacionService)
}