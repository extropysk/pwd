import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { AppConfig } from 'src/configuration'
import { cleanupOpenApiDoc } from 'nestjs-zod'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService>(ConfigService)

  app.enableCors({ credentials: true, origin: true })
  app.use(cookieParser())

  const appConfig = configService.get<AppConfig>('app') as AppConfig
  const swagger = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setVersion(appConfig.version)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swagger)
  SwaggerModule.setup('docs', app, cleanupOpenApiDoc(document))

  await app.listen(configService.get<number>('port') || 3000)
}
bootstrap()
