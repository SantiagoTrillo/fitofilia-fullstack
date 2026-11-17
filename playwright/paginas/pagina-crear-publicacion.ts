import { type Page, type Locator } from "@playwright/test"

export class PaginaCrearPublicacion {
  readonly campoTitulo: Locator
  readonly campoCuerpo: Locator
  readonly campoImagen: Locator
  readonly botonPublicar: Locator

  constructor(private readonly pagina: Page) {
    this.campoTitulo = pagina.getByRole("textbox", { name: "Título:" })
    this.campoCuerpo = pagina.getByRole("textbox", { name: "Cuerpo:" })
    this.campoImagen = pagina.getByRole("button", { name: "Imagen:" })
    this.botonPublicar = pagina.getByRole("button", { name: "Publicar" })
  }

  async crear(titulo: string, cuerpo: string, imagen: string): Promise<string> {
    const respuesta: any = this.pagina.waitForResponse((r: any): boolean =>
      r.request().method() === "POST" && r.url().endsWith("/publicaciones"))
    await this.campoTitulo.fill(titulo)
    await this.campoCuerpo.fill(cuerpo)

    await this.campoImagen.setInputFiles(imagen)

    await this.botonPublicar.click()

    return (await (await respuesta).json())._id
  }
}