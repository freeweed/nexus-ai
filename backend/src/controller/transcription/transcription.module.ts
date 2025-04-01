import { Module } from "@nestjs/common";
import { TranscriptionService } from "./transcription.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transcription } from "src/entities";
import { TranscriptionController } from "./transcription.controller";
import { WhisperService, OllamaService, EncryptionService } from "src/share/service";

@Module({
    imports: [TypeOrmModule.forFeature([Transcription])],
    providers: [
        EncryptionService,
        TranscriptionService,
        WhisperService,
        OllamaService
    ],
    controllers: [TranscriptionController]
})
export class TranscriptionModule {}