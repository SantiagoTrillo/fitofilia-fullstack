import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Navbar } from "./componentes/componentes-reutilizables/navbar/navbar"
import { AutenticacionService } from "./servicios/autenticacion-service"
import { Toast } from "./componentes/componentes-reutilizables/toast/toast"

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
  imports: [RouterOutlet, Navbar, Toast]
})
export class App { protected sesionService: AutenticacionService = inject(AutenticacionService) }