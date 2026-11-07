import { Controller, UseGuards } from "@nestjs/common"
import { AutenticacionGuard } from "../../../guardias/autenticacion.guard.js"
import { AdministradorGuard } from "../../../guardias/administrador.guard.js"
import { EstadisticasService } from "./estadisticas.service.js"

@Controller("estadisticas")
@UseGuards(AutenticacionGuard, AdministradorGuard)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}


}