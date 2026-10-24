import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"
import { NgOptimizedImage}  from "@angular/common"

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.less",
  imports: [RouterLink, NgOptimizedImage]
})
export class Navbar {}