import { Component, inject } from "@angular/core"
import { RouterLink } from "@angular/router"
import { NgOptimizedImage}  from "@angular/common"
import { AutenticacionService } from "../../../servicios/autenticacion-service"

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.less",
  imports: [RouterLink, NgOptimizedImage]
})
export class Navbar { protected autenticacionService: AutenticacionService = inject(AutenticacionService) }