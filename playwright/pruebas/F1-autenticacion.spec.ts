import { prueba, expect, usuario } from "../fixtures/prueba"
import {Route} from "@playwright/test"

prueba.describe("Inicio de sesión", (): void => {
  prueba.beforeEach(async ({ paginaInicioSesion }): Promise<void> => { await paginaInicioSesion.abrir() })

  prueba("CP1 - Inicio de sesión con credenciales válidas", async ({ page, paginaInicioSesion }): Promise<void> => {
    let liberar: () => void = (): void => {}

    const pausa: Promise<void> = new Promise<void>((resolver: (value: void | PromiseLike<void>) => void): void => { liberar = resolver })

    await page.route("**/autorizar-token", async (ruta: Route): Promise<void> => { await pausa; await ruta.continue() })

    await paginaInicioSesion.iniciarSesion(usuario.correo, usuario.contrasenia)

    await expect(page).toHaveURL("/cargando")
    await expect(page.getByText("Validando token...")).toBeVisible()
    liberar()

    await expect(page).toHaveURL("/")

    expect(await page.evaluate((): number => sessionStorage.length)).toBeGreaterThan(0)
    await page.reload()
    await expect(page).toHaveURL("/")
  })

  prueba("CP2 - Inicio de sesión con credenciales inválidas", async ({ page, paginaInicioSesion }): Promise<void> => {
    await paginaInicioSesion.iniciarSesion("inexistente@gmail.com", "Inexistente2026")

    await expect(page.getByText("Error al procesar la solicitud: credenciales inválidas")).toBeVisible()

    await expect(page).toHaveURL("/inicio-sesión")

    expect(await page.evaluate((): number => sessionStorage.length)).toBe(0)
  })
})