import { Routes } from '@angular/router'
import { MuroPublicaciones } from "./componentes/publicaciones/muro-publicaciones/muro-publicaciones"
import { Publicacion } from "./componentes/publicaciones/muro-publicaciones/publicacion/publicacion"
import { InicioSesion } from "./componentes/autenticacion/inicio-sesion/inicio-sesion"
import { autenticacionGuard } from "./guardias/autenticacion-guard"
import { formularioGuard } from "./guardias/formulario-guard"

export const routes: Routes = [
  {
    path: "",
    component: MuroPublicaciones,
    canActivate: [autenticacionGuard]
  },
  {
    path: "publicación/crear",
    loadComponent: () => import("./componentes/publicaciones/creacion-publicacion/creacion-publicacion").then(m => m.CreacionPublicacion),
    canActivate: [autenticacionGuard],
    canDeactivate: [formularioGuard]
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
    loadComponent: () => import("./componentes/autenticacion/registro/registro").then(m => m.Registro),
    canActivate: [autenticacionGuard],
    canDeactivate: [formularioGuard]
  },
  {
    path: "perfil",
    loadComponent: () => import("./componentes/autenticacion/perfil/perfil").then(m => m.Perfil),
    canActivate: [autenticacionGuard]
  },
  {
    path: "perfil/editar",
    loadComponent: () => import("./componentes/autenticacion/perfil/edicion-perfil/edicion-perfil").then(m => m.EdicionPerfil),
    canActivate: [autenticacionGuard],
    canDeactivate: [formularioGuard]
  },
  {
    path: "**",
    redirectTo: "inicio-sesión"
  }
]