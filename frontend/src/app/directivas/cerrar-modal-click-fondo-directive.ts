import { Directive, ElementRef, HostListener, inject, output, OutputEmitterRef } from "@angular/core"

@Directive({ selector: "[appCerrarModalClickFondo]"})
export class CerrarModalClickFondoDirective {
  private modal: ElementRef<HTMLDivElement> = inject(ElementRef)

  modalCerrado: OutputEmitterRef<void> = output<void>()

  @HostListener("click", ["$event"])
  protected cerrarModalClickFondo(evento: MouseEvent): void { if (evento.target === this.modal.nativeElement) this.modalCerrado.emit() }
}