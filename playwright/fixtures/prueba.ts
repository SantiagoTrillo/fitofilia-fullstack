import { test as base } from "@playwright/test"
import { PaginaInicioSesion } from "../paginas/pagina-inicio-sesion"
import { PaginaMuroPublicaciones } from "../paginas/pagina-muro-publicaciones"
import { PaginaCrearPublicacion } from "../paginas/pagina-crear-publicacion"
import { PaginaPublicacion } from "../paginas/pagina-publicacion"

export const usuario = { correo: "playwright@gmail.com", contrasenia: "Playwright2026" }

type Fixtures = {
  paginaInicioSesion: PaginaInicioSesion
  paginaMuroPublicaciones: PaginaMuroPublicaciones
  paginaCrearPublicacion: PaginaCrearPublicacion
  paginaPublicacion: PaginaPublicacion
  publicacionesCreadas: string[]
}

export const prueba = base.extend<Fixtures>({
  paginaInicioSesion: async (
    { page }, use: (r: PaginaInicioSesion) => Promise<void>
  ): Promise<void> => { await use(new PaginaInicioSesion(page)) },
  paginaCrearPublicacion: async (
    { page }, use: (r: PaginaCrearPublicacion) => Promise<void>
  ): Promise<void> => { await use(new PaginaCrearPublicacion(page)) },
  paginaPublicacion: async (
    { page }, use: (r: PaginaPublicacion) => Promise<void>
  ): Promise<void> => { await use(new PaginaPublicacion(page)) },
  paginaMuroPublicaciones: async (
    { page, paginaInicioSesion }, use: (r: PaginaMuroPublicaciones) => Promise<void>
  ): Promise<void> => {
    await paginaInicioSesion.abrir()
    await paginaInicioSesion.iniciarSesion(usuario.correo, usuario.contrasenia)
    await page.waitForURL("/")
    await use(new PaginaMuroPublicaciones(page))
  },
  publicacionesCreadas: async ({ page, request }, use: (r: string[]) => Promise<void>): Promise<void> => {
    const ids: string[] = []
    await use(ids)
    const token: string | null = await page.evaluate((): string | null => sessionStorage.getItem("token"))
    for (const id of ids) {
      await request.delete(`http://localhost:3000/publicaciones/${ id }`, { headers: { Authorization: `Bearer ${ token }` } })
    }
  }
})

export { expect } from "@playwright/test"