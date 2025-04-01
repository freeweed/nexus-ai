import { BadRequestException, Body, Controller, Delete, Get, Inject, InternalServerErrorException, LoggerService, NotFoundException, Param, Post, Query, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { TranscriptionService } from "./transcription.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { WhisperService } from "src/share/service/whisper.service";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import { SummarizeBodyDTO } from "./transcription.dto";
import { OllamaService } from "src/share/service/ollama.service";
import { PaginationQueryDTO } from "src/share/dto";
import { join } from "path";
import { existsSync } from "fs";
import { Response } from "express";

@Controller('transcription')
export class TranscriptionController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly service: TranscriptionService,
        private readonly whisperService: WhisperService,
        private readonly ollamaService: OllamaService
    ) { }

    @Get()
    async getAll(
        @Query() query: PaginationQueryDTO
    ) {
        return this.service.findAll(query.page, query.limit);
    }

    @Get('audio/:filename')
    streamAudio(
        @Param('filename') filename: string, 
        @Res() res: Response
    ) {
        const filePath = join(process.cwd(), 'uploads', filename);

        if (!existsSync(filePath)) {
            throw new NotFoundException('Audio file not found');
        }

        res.sendFile(filePath);
    }


    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const newFilename = `${uuidv4()}.webm`
                callback(null, newFilename)
            },
        }),
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = ['audio/webm', 'audio/wav', 'audio/mpeg'];

            if (!allowedMimeTypes.includes(file.mimetype)) {
                return callback(
                    new BadRequestException(`Unsupported file type: ${file.mimetype}`),
                    false,
                );
            }

            callback(null, true);
        },
    }))
    async upload(
        @UploadedFile() file: Express.Multer.File,
    ) {
        const text = await this.whisperService.transcribe(file.path)
        const result = await this.service.create({
            filename: file.filename,
            filepath: file.path,
            transcription: text
        })
        return {
            ...result,
            transcription: text
        }
    }

    @Post('summarize')
    async summarize(
        @Body() body: SummarizeBodyDTO
    ) {
        return this.ollamaService.summarize(body.text)
    }

    @Delete(':id')
    async delete(
        @Param('id') id: number
    ) {
        return this.service.delete(id);
    }
}
