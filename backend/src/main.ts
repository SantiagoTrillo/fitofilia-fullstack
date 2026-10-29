import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module.js'
import { join } from 'path'

async function bootstrap(): Promise<void> {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({ origin: 'http://localhost:4200', credentials: true })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useStaticAssets(join(process.cwd(), 'subidas'), { prefix: '/subidas/' })

  const puerto: number = Number(process.env.PORT) || 3000

  await app.listen(puerto)

  console.log(`Backend de Fitofilia corriendo en http://localhost:${puerto}`)
}

await bootstrap()
