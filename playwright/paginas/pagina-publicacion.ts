import { type Page, type Locator } from "@playwright/test"

export class PaginaPublicacion {
  readonly cajaComentario: Locator
  readonly botonPublicar: Locator
  readonly contadorComentarios: Locator

  constructor(private readonly pagina: Page) {
    this.cajaComentario = pagina.getByRole("textbox")
    this.botonPublicar = pagina.getByRole("button", { name: "Publicar" })
    this.contadorComentarios = pagina.locator("button.boton-comentarios")
  }

  comentario(texto: string): Locator { return this.pagina.getByText(texto) }

  async comentar(texto: string): Promise<void> {
    await this.cajaComentario.fill(texto)

    await this.botonPublicar.click()
  }
}