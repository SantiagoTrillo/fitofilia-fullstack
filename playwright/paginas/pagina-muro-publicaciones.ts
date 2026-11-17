import { type Page, type Locator } from "@playwright/test"

export class PaginaMuroPublicaciones {
  readonly botonCrearPublicacion: Locator

  constructor(private readonly pagina: Page) { this.botonCrearPublicacion = pagina.getByRole("button", { name: "Crear publicación" }) }

  async abrir(): Promise<void> { await this.pagina.goto("/") }

  buscarPublicacion(titulo: string): Locator { return this.pagina.locator("div.publicacion").filter({ hasText: titulo }) }

  buscarBotonComentarios(titulo: string): Locator { return this.buscarPublicacion(titulo).locator("button.boton-comentarios") }

  buscarDetallesPublicacion(titulo: string): { titulo: Locator, cuerpo: Locator, imagen: Locator, autor: Locator } {
    const publicacion: Locator = this.buscarPublicacion(titulo)

    return {
      titulo: publicacion.locator("h2"),
      cuerpo: publicacion.locator("p.cuerpo-publicacion"),
      imagen: publicacion.getByAltText("Imagen de una publicación"),
      autor: publicacion.locator(".informacion")
    }
  }
}