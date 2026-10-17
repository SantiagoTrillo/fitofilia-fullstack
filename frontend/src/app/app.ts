import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Navbar } from "./componentes/navbar/navbar"
import { SesionService } from "./servicios/sesion-service"

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
  imports: [RouterOutlet, Navbar]
})
export class App {
  protected sesionService: SesionService = inject(SesionService)
}