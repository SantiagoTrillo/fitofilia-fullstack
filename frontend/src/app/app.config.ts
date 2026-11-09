import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from "@angular/core"
import { provideRouter } from "@angular/router"
import { routes } from "./app.routes"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { autenticacionInterceptor } from "./interceptores/autenticacion-interceptor"
import { provideServiceWorker } from "@angular/service-worker"

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([autenticacionInterceptor])),
    provideRouter(routes),
    provideServiceWorker("ngsw-worker.js", { enabled: !isDevMode() })
  ]
}