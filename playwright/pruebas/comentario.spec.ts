import { test, expect } from "@playwright/test"
import { iniciarSesion } from "./helpers/iniciar-sesion"

const texto: string = "Comentario de prueba"

test.describe("Creación de un comentario", (): void => {
  test.beforeEach(async ({ page }): Promise<void> => {
    await iniciarSesion(page)
    await page.goto("/")
  })

  test("CP5 - Creación de un comentario válido", async ({ page }): Promise<void> => {
    await page.getByRole('button', { name: '' }).first().click()
    await page.getByRole('textbox').fill(texto)
    await page.getByRole('button', { name: 'Publicar' }).click()

    await expect(page.getByText('Playwright - ahoraComentario')).toBeVisible()

    await expect(page.getByText('Comentario publicado')).toBeVisible()
  })

  test("CP6 - Validación del formulario de comentario", async ({ page }): Promise<void> => {
    await page.getByRole('button', { name: '' }).first().click()
    await page.getByRole('button', { name: 'Publicar' }).click()
    await page.getByRole('textbox').fill("pp")
    await page.getByRole('button', { name: 'Publicar' }).click()

    await expect(page).toHaveURL("/publicación")

    await expect(page.getByText('Comentario inválido')).toBeVisible()
  })
})