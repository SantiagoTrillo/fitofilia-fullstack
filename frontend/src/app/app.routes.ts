import { Routes } from '@angular/router'
import { MuroPublicaciones } from "./componentes/publicaciones/muro-publicaciones/muro-publicaciones"
import { InicioSesion } from "./componentes/autenticacion/inicio-sesion/inicio-sesion"
import { autenticacionGuard } from "./guardias/autenticacion-guard"
import { formularioGuard } from "./guardias/formulario-guard"
import { PaginaPublicacion } from "./componentes/publicaciones/pagina-publicacion/pagina-publicacion"
import { PaginaCargando } from "./componentes/pagina-cargando/pagina-cargando"
import { administradorGuard } from "./guardias/administrador-guard"

export const routes: Routes = [
  {
    path: "",
    component: MuroPublicaciones,
    canActivate: [autenticacionGuard]
  },
  {
    path: "cargando",
    component: PaginaCargando,
    canActivate: [autenticacionGuard]
  },
  {
    path: "publicación/crear",
    loadComponent: () =>
      import("./componentes/publicaciones/creacion-publicacion/creacion-publicacion").then(m => m.CreacionPublicacion),
    canActivate: [autenticacionGuard],
    canDeactivate: [formularioGuard]
  },
  {
    path: "publicación",
    component: PaginaPublicacion,
    canActivate: [autenticacionGuard]
  },
  {
    path: "publicación/editar",
    loadComponent: () =>
      import("./componentes/publicaciones/muro-publicaciones/publicacion/edicion-publicacion/edicion-publicacion")
        .then(m => m.EdicionPublicacion),
    canActivate: [autenticacionGuard],
    canDeactivate: [formularioGuard]
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
    loadComponent: () =>
      import("./componentes/autenticacion/perfil/edicion-perfil/edicion-perfil").then(m => m.EdicionPerfil),
    canActivate: [autenticacionGuard],
    canDeactivate: [formularioGuard]
  },
  {
    path: "panel-control/estadisticas",
    loadComponent: () =>
      import("./componentes/panel-control/estadisticas/estadisticas").then(m => m.Estadisticas),
    canActivate: [autenticacionGuard, administradorGuard]
  },
  {
    path: "panel-control/usuarios",
    loadComponent: () =>
      import("./componentes/panel-control/usuarios/listado-usuarios/listado-usuarios").then(m => m.ListadoUsuarios),
    canActivate: [autenticacionGuard, administradorGuard]
  },
  {
    path: "**",
    redirectTo: "inicio-sesión"
  }
]