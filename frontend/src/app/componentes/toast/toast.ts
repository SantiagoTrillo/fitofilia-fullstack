import { Component, inject } from "@angular/core"
import { ToastService } from "../../servicios/toast-service"

@Component({
  selector: "app-toast",
  templateUrl: "./toast.html",
  styleUrl: "./toast.less"
})
export class Toast { toastService: ToastService = inject(ToastService) }