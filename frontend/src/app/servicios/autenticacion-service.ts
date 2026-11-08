import { inject, Service, signal, WritableSignal } from "@angular/core"
import { ToastService } from "./toast-service"
import { UsuarioInterface } from "../interfaces/usuario-interface"
import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"
import { entorno } from "../../entornos/entorno"
import { firstValueFrom } from "rxjs"

@Service()
export class AutenticacionService {
  private readonly urlApi: string = `${ entorno.urlApi }`
  private readonly duracionSesion: number = 15 * 60 * 1000
  private readonly tiempoAviso: number = 10 * 60 * 1000

  private toastService: ToastService = inject(ToastService)
  private httpClient: HttpClient = inject(HttpClient)
  private router: Router = inject(Router)
  private temporizadorAviso: ReturnType<typeof setTimeout> | null = null
  private temporizadorExpiracion: ReturnType<typeof setTimeout> | null = null

  usuarioActual: WritableSignal<UsuarioInterface | null> = signal<UsuarioInterface | null>(
    sessionStorage.getItem("usuarioActual") ? JSON.parse(sessionStorage.getItem("usuarioActual")!) : null
  )
  token: WritableSignal<string | null> = signal<string | null>(sessionStorage.getItem("token") || null)
  mostrarModal: WritableSignal<boolean> = signal<boolean>(false)

  private iniciarTemporizadores(expiracion: number = Date.now() + this.duracionSesion): void {
    this.restablecerTemporizadores()
    this.mostrarModal.set(false)
    sessionStorage.setItem("expiracionSesion", expiracion.toString())

    const tiempoRestante: number = expiracion - Date.now()

    if (tiempoRestante <= 0) {
      this.temporizadorExpiracion = setTimeout((): void => {
        this.cerrarSesion()
        this.toastService.mostrarToast("Sesión expirada", "informacion")
        void this.router.navigate(["/inicio-sesión"])
      }, 0)

      return
    }

    this.temporizadorAviso = setTimeout(
      (): void => this.mostrarModal.set(true), Math.max(0, tiempoRestante - (this.duracionSesion - this.tiempoAviso))
    )
    this.temporizadorExpiracion = setTimeout((): void => {
      this.cerrarSesion()
      this.toastService.mostrarToast("Sesión expirada", "informacion")
      void this.router.navigate(["/inicio-sesión"])
    }, tiempoRestante)
  }

  private restablecerTemporizadores(): void {
    if (this.temporizadorAviso !== null) clearTimeout(this.temporizadorAviso)
    if (this.temporizadorExpiracion !== null) clearTimeout(this.temporizadorExpiracion)

    this.temporizadorAviso = null
    this.temporizadorExpiracion = null
  }

  constructor() {
    if (this.token()) {
      const expiracionSesion: number = Number(sessionStorage.getItem("expiracionSesion"))

      this.iniciarTemporizadores(expiracionSesion)
    }
  }

  async iniciarSesion(correo: string, contrasenia: string): Promise<UsuarioInterface | null> {
    try {
      const respuesta: any = await firstValueFrom(this.httpClient.post<any>(`${ this.urlApi }/inicio-sesion`, { correo, contrasenia }))

      this.usuarioActual.set(respuesta.usuario)
      this.token.set(respuesta.token)
      sessionStorage.setItem("usuarioActual", JSON.stringify(respuesta.usuario))
      sessionStorage.setItem("token", respuesta.token)
      this.iniciarTemporizadores()

      return respuesta.usuario
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al iniciar sesión"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return null
    }
  }

  async registrarUsuario(usuarioNuevo: any): Promise<UsuarioInterface | null> {
    try {
      const respuesta: any = await firstValueFrom(this.httpClient.post<any>(`${ this.urlApi }/registro`, usuarioNuevo))

      this.usuarioActual.set(respuesta.usuario)
      this.token.set(respuesta.token)
      sessionStorage.setItem("usuarioActual", JSON.stringify(respuesta.usuario))
      sessionStorage.setItem("token", respuesta.token)
      this.iniciarTemporizadores()

      return respuesta.usuario
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al registrarse"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return null
    }
  }

  async autorizarAcceso(token: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpClient.post<string>(`${ this.urlApi }/autorizar-token`, token))

      return true
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al verificar el token"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return false
    }
  }

  async refrescarToken(): Promise<boolean> {
    try {
      const tokenRefrescado: string = await firstValueFrom(
        this.httpClient.post(`${ this.urlApi }/refrescar-token`, null, { responseType: "text" })
      )

      this.token.set(tokenRefrescado)
      sessionStorage.setItem("token", tokenRefrescado)
      this.iniciarTemporizadores()

      return true
    } catch (error: any) {
      const mensaje: string = error.error?.message || "Error al refrescar el token"

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return false
    }
  }

  async editarPerfil(perfilEditado: FormData): Promise<boolean> {
    try {
      const usuarioActualizado: UsuarioInterface = await firstValueFrom(
        this.httpClient.patch<UsuarioInterface>(`${ this.urlApi }/usuarios/${ this.usuarioActual()?._id }`, perfilEditado)
      )

      this.usuarioActual.set(usuarioActualizado)
      sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioActualizado))

      return true
    } catch (error: any) {
      const mensaje: string = error.error.message

      this.toastService.mostrarToast(`Error al procesar la solicitud: ${ mensaje }`, "error")

      return false
    }
  }

  cerrarSesion(): void {
    this.restablecerTemporizadores()
    this.mostrarModal.set(false)
    this.usuarioActual.set(null)
    this.token.set(null)
    sessionStorage.removeItem("usuarioActual")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("expiracionSesion")
  }

  cerrarModal(): void { this.mostrarModal.set(false) }
}