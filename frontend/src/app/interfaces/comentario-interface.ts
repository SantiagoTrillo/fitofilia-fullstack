export interface ComentarioInterface {
  _id: string
  texto: string
  autor: {
    _id: string
    nombreUsuario: string
    fotoPerfil?: string
  }
  modificado: boolean
  disponible: boolean
  createdAt: string
}