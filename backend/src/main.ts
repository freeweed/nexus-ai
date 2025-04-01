import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrerequestInterceptor } from './interceptions/prerequest.interceptos'
import { ClsService } from 'nestjs-cls'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })
  app.enableCors()

  // Logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER)
  app.useLogger(logger)
  
  // CLS
  const clsService = app.get(ClsService)
  app.useGlobalInterceptors(new PrerequestInterceptor(clsService))
  
  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000)
}
bootstrap();
