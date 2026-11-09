import { Pipe, PipeTransform } from "@angular/core"

@Pipe({ name: "inicialesUsuario" })
export class InicialesUsuarioPipe implements PipeTransform {
  transform(nombreUsuario: string | null | undefined): string {
    if (!nombreUsuario?.trim()) return "?"

    const palabras: string[] = nombreUsuario.trim().split(/\s+/)

    return palabras.length > 1 ? `${ palabras[0][0] }${ palabras[palabras.length - 1][0] }`.toLocaleUpperCase("es")
      : palabras[0].slice(0, 2).toLocaleUpperCase("es")
  }
}