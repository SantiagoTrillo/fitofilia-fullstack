import { Routes } from '@angular/router'
import { PaginaPrincipal } from "./componentes/pagina-principal/pagina-principal"
import { Publicacion } from "./componentes/publicacion/publicacion"
import { InicioSesion } from "./componentes/inicio-sesion/inicio-sesion"
import { autenticacionGuard } from "./guardias/autenticacion-guard"

export const routes: Routes = [
  {
    path: "",
    component: PaginaPrincipal,
    canActivate: [autenticacionGuard]
  },
  {
    path: "publicación",
    component: Publicacion,
    canActivate: [autenticacionGuard]
  },
  {
    path: "inicio-sesión",
    component: InicioSesion,
    canActivate: [autenticacionGuard]
  },
  {
    path: "registro",
    loadComponent: () => import("./componentes/registro/registro").then(m => m.Registro),
    canActivate: [autenticacionGuard]
  },
  {
    path: "perfil",
    loadComponent: () => import("./componentes/perfil/perfil").then(m => m.Perfil),
    canActivate: [autenticacionGuard]
  },
  {
    path: "**",
    redirectTo: "inicio-sesión"
  }
]