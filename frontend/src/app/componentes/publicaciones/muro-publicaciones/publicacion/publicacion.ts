import { Component, inject, input, InputSignal } from "@angular/core"
import { PublicacionInterface } from "../../../../interfaces/publicacion-interface"
import { Router } from "@angular/router"
import { PublicacionService } from "../../../../servicios/publicacion-service"

@Component({
  selector: "app-publicacion",
  templateUrl: "./publicacion.html",
  styleUrl: "./publicacion.less"
})
export class Publicacion {
  private publicacionService: PublicacionService = inject(PublicacionService)
  private router: Router = inject(Router)

  publicacion: InputSignal<PublicacionInterface> = input.required<PublicacionInterface>()

  protected abrirPublicacion(publicacionSeleccionada: PublicacionInterface): void {
    this.publicacionService.seleccionarPublicacion(publicacionSeleccionada)
    this.router.navigate(["/publicación"])
  }
}