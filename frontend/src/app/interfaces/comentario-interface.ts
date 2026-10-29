export interface ComentarioInterface {
  _id: string
  texto: string
  autor: {
    _id: string
    nombreUsuario: string
    fotoPerfil?: string
  }
  corazones?: number
  respuestas: ComentarioInterface[]
  disponible: boolean
  createdAt: string
}