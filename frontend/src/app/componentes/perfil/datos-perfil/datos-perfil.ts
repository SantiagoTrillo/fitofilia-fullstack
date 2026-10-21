import { Component, input, InputSignal } from "@angular/core"
import { DatePipe } from "@angular/common"
import { UsuarioInterface } from "../../../interfaces/usuario-interface"

@Component({
  selector: "app-datos-perfil",
  templateUrl: "./datos-perfil.html",
  styleUrl: "./datos-perfil.less",
  imports: [DatePipe]
})
export class DatosPerfil { usuarioActual: InputSignal<UsuarioInterface> = input.required<UsuarioInterface>() }