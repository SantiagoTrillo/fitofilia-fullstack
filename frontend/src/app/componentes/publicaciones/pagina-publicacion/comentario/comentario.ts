import { Component, input, InputSignal } from "@angular/core"
import { DatePipe } from "@angular/common"
import { ComentarioInterface } from "../../../../interfaces/comentario-interface"

@Component({
  selector: "app-comentario",
  templateUrl: "./comentario.html",
  styleUrl: "./comentario.less",
  imports: [DatePipe]
})
export class Comentario {
  comentario: InputSignal<ComentarioInterface> = input.required<ComentarioInterface>()
}