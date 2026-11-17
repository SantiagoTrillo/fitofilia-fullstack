import { type Page, type Locator } from "@playwright/test"

export class PaginaInicioSesion {
  readonly campoCorreo: Locator
  readonly campoContrasenia: Locator
  readonly botonIniciarSesion: Locator

  constructor(private readonly pagina: Page) {
    this.campoCorreo = pagina.getByRole("textbox", { name: "Correo:" })
    this.campoContrasenia = pagina.getByRole("textbox", { name: "Contraseña:" })
    this.botonIniciarSesion = pagina.getByRole("button", { name: "Iniciar sesión", exact: true })
  }

  async abrir(): Promise<void> { await this.pagina.goto("/inicio-sesión") }

  async iniciarSesion(correo: string, contrasenia: string): Promise<void> {
    await this.campoCorreo.fill(correo)
    await this.campoContrasenia.fill(contrasenia)
    await this.botonIniciarSesion.click()
  }
}