import { test, expect } from "@playwright/test"

const correo = "playwright@gmail.com"
const contrasenia = "Playwright2026"

test.describe("Inicio de sesión", (): void => {
  test.beforeEach(async ({ page }): Promise<void> => { await page.goto("/inicio-sesión") })

  test("CP1 - Inicio de sesión con credenciales válidas", async ({ page }): Promise<void> => {
    await page.getByRole("textbox", { name: "Correo:" }).fill(correo)
    await page.getByRole("textbox", { name: "Contraseña:" }).fill(contrasenia)
    await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click()

    await expect(page).toHaveURL("/cargando")
    await expect(page.getByText("Validando token...")).toBeVisible()

    await expect(page).toHaveURL("/")

    expect(await page.evaluate((): number => sessionStorage.length)).toBeGreaterThan(0)
    await page.reload()
    await expect(page).toHaveURL("/")
  })

  test("CP2 - Inicio de sesión con credenciales inválidas", async ({ page }): Promise<void> => {
    await page.getByRole("textbox", { name: "Correo:" }).fill("inexistente@gmail.com")
    await page.getByRole("textbox", { name: "Contraseña:" }).fill("Inexistente2026")
    await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click()

    await expect(page.getByText("Error al procesar la solicitud: credenciales inválidas")).toBeVisible()

    await expect(page).toHaveURL("/inicio-sesión")

    expect(await page.evaluate((): number => sessionStorage.length)).toBe(0)
  })
})