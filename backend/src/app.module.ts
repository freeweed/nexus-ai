import { Module } from '@nestjs/common';
import { GlobalClsModule } from './share/module/cls.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './share/module/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entities } from './entities';
import { TranscriptionModule } from './controller/transcription/transcription.module';
import { NoteModule } from './controller/note/note.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: Entities,
        synchronize: config.get<string>('NODE_ENV') === 'local',
      }),
    }),
    GlobalClsModule, 
    LoggerModule,
    TranscriptionModule,
    NoteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
