import { NestFactory } from '@nestjs/core'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module.js'

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule)

  app.enableCors({ origin: 'http://localhost:4200', credentials: true })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))

  const puerto: number = Number(process.env.PUERTO) ?? 3000

  await app.listen(puerto)

  console.log(`Backend de Fitofilia corriendo en http://localhost:${puerto}`)
}

await bootstrap()