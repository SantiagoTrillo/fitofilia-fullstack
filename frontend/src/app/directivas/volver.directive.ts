import { Directive, HostListener, inject } from "@angular/core"
import { Location } from "@angular/common"

@Directive({
  selector: "[appVolver]"
})
export class VolverDirective {
  private location: Location = inject(Location)

  @HostListener("click")
  onClick(): void {
    this.location.back()
  }
}