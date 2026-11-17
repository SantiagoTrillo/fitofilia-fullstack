import path from "node:path"
import { prueba, expect } from "../fixtures/prueba"

const titulo: string = `Publicación de prueba ${ Date.now() }`
const texto: string = "Comentario de prueba"
const imagen: string = path.resolve(__dirname, "../datos/imagen-prueba.jpg")

prueba.describe("Creación de un comentario", (): void => {
  prueba.beforeEach(async (
    { page, paginaMuroPublicaciones, paginaCrearPublicacion, publicacionesCreadas }
  ): Promise<void> => {
    await paginaMuroPublicaciones.botonCrearPublicacion.click()
    publicacionesCreadas.push(await paginaCrearPublicacion.crear(titulo, "Cuerpo de prueba", imagen))
    await expect(page).toHaveURL("/")
  })

  prueba("CP5 - Creación de un comentario válido", async (
    { page, paginaMuroPublicaciones, paginaPublicacion }
  ): Promise<void> => {
    await paginaMuroPublicaciones.buscarBotonComentarios(titulo).click()
    const contadorComentarios: number = parseInt(await paginaPublicacion.contadorComentarios.innerText()) || 0

    await paginaPublicacion.comentar(texto)

    await expect(paginaPublicacion.comentario(texto)).toBeVisible()

    await expect(paginaPublicacion.contadorComentarios).toContainText(String(contadorComentarios + 1))

    await expect(page.getByText("Comentario publicado correctamente")).toBeVisible()
  })

  prueba("CP6 - Validación del formulario de comentario", async (
    { page, paginaMuroPublicaciones, paginaPublicacion }
  ): Promise<void> => {
    await paginaMuroPublicaciones.buscarBotonComentarios(titulo).click()
    await paginaPublicacion.botonPublicar.click()
    await paginaPublicacion.comentar("pp")

    await expect(page).toHaveURL("/publicación")

    await expect(page.getByText("Comentario inválido")).toBeVisible()
  })
})