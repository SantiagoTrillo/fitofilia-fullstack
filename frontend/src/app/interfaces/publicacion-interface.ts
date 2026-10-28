import { ComentarioInterface } from "./comentario-interface"

export interface PublicacionInterface {
  _id: string
  titulo: string
  imagen?: string
  cuerpo: string
  autor: {
    _id: string
    nombreUsuario: string
    fotoPerfil?: string
  }
  corazones?: number
  dadoresCorazones?: string[]
  comentarios?: ComentarioInterface[]
  disponible: boolean
  createdAt: string
}