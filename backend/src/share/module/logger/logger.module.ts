import { Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { requestIdFormat } from './request-id-format'

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            requestIdFormat(),
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context, requestId }) => {
              return `[${requestId}] [${timestamp}] [${level}] [${context || 'App'}] ${message}`;
            })
          ),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
