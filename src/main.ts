import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { JWT_COOKIE_NAME } from 'src/core/guards/jwt.guard'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService>(ConfigService)

  app.enableCors({ credentials: true, origin: true })
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Passwordless')
    .setDescription('Passwordless API')
    .setVersion(process.env.npm_package_version)
    .addCookieAuth(JWT_COOKIE_NAME)
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(configService.get<number>('PORT'))
}
bootstrap()
