import { Routes } from '@angular/router'
import { PaginaPrincipal } from "./componentes/pagina-principal/pagina-principal"
import { Publicacion } from "./componentes/publicacion/publicacion"
import { InicioSesion } from "./componentes/inicio-sesion/inicio-sesion"
import { sesionGuard } from "./guardias/sesion-guard"

export const routes: Routes = [
  {
    path: "",
    component: PaginaPrincipal,
    canActivate: [sesionGuard]
  },
  {
    path: "publicación",
    component: Publicacion,
    canActivate: [sesionGuard]
  },
  {
    path: "inicio-sesión",
    component: InicioSesion,
    canActivate: [sesionGuard]
  },
  {
    path: "registro",
    loadComponent: () => import("./componentes/registro/registro").then(m => m.Registro),
    canActivate: [sesionGuard]
  },
  {
    path: "perfil",
    loadComponent: () => import("./componentes/perfil/perfil").then(m => m.Perfil),
    canActivate: [sesionGuard]
  },
  {
    path: "**",
    redirectTo: "inicio-sesión"
  }
]