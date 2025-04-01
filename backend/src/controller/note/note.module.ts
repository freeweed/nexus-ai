import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";
import { Note, Transcription } from "src/entities";
import { EncryptionService } from "src/share/service";

@Module({
    imports: [TypeOrmModule.forFeature([Note, Transcription])],
    providers: [NoteService, EncryptionService],
    controllers: [NoteController]
})
export class NoteModule {}