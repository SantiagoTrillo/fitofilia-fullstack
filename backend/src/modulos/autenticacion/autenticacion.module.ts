import { forwardRef, Module } from "@nestjs/common"
import { AutenticacionService } from "./autenticacion.service.js"
import { AutenticacionController } from "./autenticacion.controller.js"
import { UsuariosModule } from "../usuarios/usuarios.module.js"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AutenticacionGuard } from "../../guardias/autenticacion.guard.js"
import { AdministradorGuard } from "../../guardias/administrador.guard.js"

@Module({
  imports: [
    forwardRef((): typeof UsuariosModule => UsuariosModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): any => ({
        secret: configService.get<string>("SECRETO_JWT"), signOptions: { expiresIn: "15m" }
      })
    })
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, AutenticacionGuard, AdministradorGuard],
  exports: [AutenticacionService, JwtModule, AutenticacionGuard, AdministradorGuard]
})
export class AutenticacionModule {}