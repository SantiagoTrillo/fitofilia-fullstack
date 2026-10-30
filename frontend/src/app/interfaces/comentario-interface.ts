export interface ComentarioInterface {
  _id: string
  texto: string
  autor: {
    _id: string
    nombreUsuario: string
    fotoPerfil?: string
  }
  disponible: boolean
  createdAt: string
}