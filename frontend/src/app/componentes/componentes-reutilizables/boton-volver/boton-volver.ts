import { Component } from "@angular/core"
import { VolverDirective } from "../../../directivas/volver.directive"

@Component({
  selector: "app-boton-volver",
  templateUrl: "./boton-volver.html",
  styleUrl: "./boton-volver.less",
  imports: [VolverDirective]
})
export class BotonVolver {}