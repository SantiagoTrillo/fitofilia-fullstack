import { Component, inject } from "@angular/core"
import { Router, RouterLink } from "@angular/router"
import { AutenticacionService } from "../../../servicios/autenticacion-service"
import { DatosPerfil } from "./datos-perfil/datos-perfil"
import { UltimasPublicaciones } from "./ultimas-publicaciones/ultimas-publicaciones"

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.html",
  styleUrl: "./perfil.less",
  imports: [DatosPerfil, RouterLink, UltimasPublicaciones]
})
export class Perfil {
  private router: Router = inject(Router)

  protected autenticacionService: AutenticacionService = inject(AutenticacionService)

  protected cerrarSesion(): void {
    this.autenticacionService.cerrarSesion()
    void this.router.navigate([""])
  }
}