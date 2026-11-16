import { test, expect } from "@playwright/test"
import path from "node:path"
import { iniciarSesion } from "./helpers/iniciar-sesion"

const titulo: string = "Publicación de prueba"
const cuerpo: string = "Cuerpo de prueba"
const imagen: string = path.resolve(__dirname, "20260819_173302.jpg")

test.describe("Creación de una publicación", (): void => {
  test.beforeEach(async ({ page }): Promise<void> => {
    await iniciarSesion(page)
    await page.goto("/")
  })

  test("CP3 - Creación de una publicación válida", async ({ page }): Promise<void> => {
    await page.getByRole('button', { name: 'Crear publicación' }).click()
    await page.getByRole('textbox', { name: 'Título:' }).fill(titulo)
    await page.getByRole('textbox', { name: 'Cuerpo:' }).fill(cuerpo)
    await page.getByRole('button', { name: 'Imagen:' }).setInputFiles(imagen)
    await page.getByRole('button', { name: 'Publicar' }).click()

    await expect(page).toHaveURL("/")

    await expect(page.getByText('PLPlaywright- ahoraPublicación de pruebaCuerpo de prueba00')).toBeVisible()

    await expect(page.getByText("Publicación creada")).toBeVisible()
  })

  test("CP4 - Validación del formulario de publicación", async ({ page }): Promise<void> => {
    await page.getByRole('button', { name: 'Crear publicación' }).click()
    await page.getByRole('button', { name: 'Publicar' }).click()
    await page.getByRole('textbox', { name: 'Título:' }).fill("pp")
    await page.getByRole('textbox', { name: 'Cuerpo:' }).fill("pp")
    await page.getByRole('button', { name: 'Publicar' }).click()

    await expect(page).toHaveURL("/publicación/crear")

    await expect(page.getByText('Campos del formulario invá')).toBeVisible()
  })
})