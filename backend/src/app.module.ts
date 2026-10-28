import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { AppController } from "./app.controller.js"
import { AppService } from "./app.service.js"
import { UsuariosModule } from "./modulos/usuarios/usuarios.module.js"
import { AutenticacionModule } from "./modulos/autenticacion/autenticacion.module.js"
import { PublicacionesModule } from "./modulos/publicaciones/publicaciones.module.js"
import {ArchivosService} from "./archivos.service.js";

@Module({
  controllers: [AppController],
  providers: [AppService, ArchivosService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("URI_MONGODB"),
        dbName: "fitofilia",
        tls: true,
        tlsAllowInvalidCertificates: true
      })
    }),
    UsuariosModule,
    AutenticacionModule,
    PublicacionesModule
  ],
  exports: [ArchivosService]
})
export class AppModule {}