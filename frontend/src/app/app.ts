import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Navbar } from "./componentes/navbar/navbar"
import { AutenticacionService } from "./servicios/autenticacion-service"
import { Toast } from "./componentes/toast/toast"

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
  imports: [RouterOutlet, Navbar, Toast]
})
export class App { protected sesionService: AutenticacionService = inject(AutenticacionService) }