export interface UsuarioInterface {
  _id: string
  nombre: string
  apellido: string
  correo: string
  nombreUsuario: string
  fechaNacimiento: string
  descripcion?: string
  fotoPerfil?: string
  perfil: string
  disponible: boolean
}