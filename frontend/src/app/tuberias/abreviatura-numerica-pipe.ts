import { Pipe, PipeTransform } from "@angular/core"

@Pipe({ name: "abreviaturaNumerica" })
export class AbreviaturaNumericaPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    if (valor === null || valor === undefined || !Number.isFinite(valor)) return "0"

    return new Intl.NumberFormat("en", { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }).format(valor)
  }
}