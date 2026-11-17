import path from "node:path"
import { prueba, expect } from "../fixtures/prueba"

const titulo: string = `Publicación de prueba ${ Date.now() }`
const cuerpo: string = "Cuerpo de prueba"
const imagen: string = path.resolve(__dirname, "../datos/imagen-prueba.jpg")

prueba.describe("Creación de una publicación", (): void => {
  prueba("CP3 - Creación de una publicación válida", async (
    { page, paginaMuroPublicaciones, paginaCrearPublicacion, publicacionesCreadas }
  ): Promise<void> => {
    await paginaMuroPublicaciones.botonCrearPublicacion.click()
    publicacionesCreadas.push(await paginaCrearPublicacion.crear(titulo, cuerpo, imagen))

    await expect(page).toHaveURL("/")

    const detalles = paginaMuroPublicaciones.buscarDetallesPublicacion(titulo)
    await expect(detalles.titulo).toHaveText(titulo)
    await expect(detalles.cuerpo).toHaveText(cuerpo)
    await expect(detalles.imagen).toBeVisible()
    await expect(detalles.autor).toContainText("Playwright")

    await expect(page.getByText("Publicación creada")).toBeVisible()
  })

  prueba("CP4 - Validación del formulario de publicación", async (
    { page, paginaMuroPublicaciones, paginaCrearPublicacion }
  ): Promise<void> => {
    await paginaMuroPublicaciones.botonCrearPublicacion.click()
    await paginaCrearPublicacion.botonPublicar.click()
    await paginaCrearPublicacion.campoTitulo.fill("pp")
    await paginaCrearPublicacion.campoCuerpo.fill("pp")
    await paginaCrearPublicacion.botonPublicar.click()

    await expect(page).toHaveURL("/publicación/crear")

    await expect(page.getByText("Campos del formulario inválidos")).toBeVisible()
  })
})