import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { AppController } from "./app.controller.js"
import { AppService } from "./app.service.js"
import { UsuariosModule } from "./usuarios/usuarios.module.js"
import { AutenticacionModule } from "./autenticacion/autenticacion.module.js"
import { PublicacionesModule } from "./publicaciones/publicaciones.module.js"

@Module({
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
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}