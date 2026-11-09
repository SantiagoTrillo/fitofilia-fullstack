import { Pipe, PipeTransform } from "@angular/core"

@Pipe({ name: "tiempoTranscurrido" })
export class TiempoTranscurridoPipe implements PipeTransform {
  transform(fecha: string | Date | null | undefined): string {
    if (!fecha) return ""

    const milisegundosFecha: number = new Date(fecha).getTime()

    if (Number.isNaN(milisegundosFecha)) return ""

    const segundos: number = Math.round((milisegundosFecha - Date.now()) / 1000)
    const unidades: [Intl.RelativeTimeFormatUnit, number][] = [
      ["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60], ["second", 1]
    ]
    const unidad: [Intl.RelativeTimeFormatUnit, number] = unidades.find(([, duracion]): boolean =>
      Math.abs(segundos) >= duracion) ?? unidades[unidades.length - 1]

    return new Intl.RelativeTimeFormat("es", { numeric: "auto" }).format(Math.round(segundos / unidad[1]), unidad[0])
  }
}