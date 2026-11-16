import { expect, type Page } from "@playwright/test"

export async function iniciarSesion(page: Page): Promise<void> {
  await page.goto("/inicio-sesión")
  await page.getByRole("button", { name: "Iniciar sesión rápido" }).click()

  await expect(page).toHaveURL("/")
}