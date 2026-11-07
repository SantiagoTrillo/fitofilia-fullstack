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
  modificada: boolean
  disponible: boolean
  createdAt: string
}