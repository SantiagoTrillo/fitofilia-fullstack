import { AfterViewInit, Directive, ElementRef, HostListener, inject } from "@angular/core"

@Directive({ selector: "textarea[appAjustarAlturaTextarea]"})
export class AjustarAlturaTextareaDirective implements AfterViewInit {
  private textarea: ElementRef<HTMLTextAreaElement> = inject(ElementRef)

  ngAfterViewInit(): void { this.ajustarAltura() }

  @HostListener("input")
  protected ajustarAltura(): void {
    this.textarea.nativeElement.style.height = "auto"
    this.textarea.nativeElement.style.height = `${ this.textarea.nativeElement.scrollHeight }px`
  }
}