import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Note, Transcription } from "src/entities";
import { DataSource, In, Repository } from "typeorm";
import { CreateNoteDto, UpdateNoteDto } from "./note.dto";
import { Transactional } from "src/decorator";
import { EncryptionService } from "src/share/service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NoteService {
    constructor(
        @InjectDataSource() private dataSource: DataSource,
        @InjectRepository(Note)
        private readonly repository: Repository<Note>,
        @InjectRepository(Transcription)
        private readonly transcriptionRepository: Repository<Transcription>,
        private readonly encryptService: EncryptionService,
        private readonly config: ConfigService
    ) { }

    async findAll(page: number = 1, limit: number = 10, search?: string) {
        const queryBuilder = this.repository.createQueryBuilder('note');

        if (search) {
            queryBuilder.andWhere(
                `(note.title ILIKE :search OR note.content::text ILIKE :search)`,
                { search: `%${search}%` },
            );
        }

        const [items, total] = await queryBuilder
            .orderBy('note.created', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);
        const lastPage = totalPages === 0 ? 1 : totalPages

        return {
            items,
            total,
            nextPage: +lastPage !== +page ? +page + 1 : null,
            prevPage: page !== 1 ? page - 1 : null,
            lastPage,
            page
        };
    }

    async findOne(id: number, needTrascription: boolean = false) {
        const query: Record<string, any> = {
            where: { id }
        }
        if(needTrascription){
            query.relations = ['transcriptions']
        }
        const note = await this.repository.findOne(query)
        if (!note) {
            throw new NotFoundException('Note not found')
        }
        if(note.summary){
            note.summary = this.encryptService.decrypt(note.summary)
        }
        note.transcriptions = note.transcriptions.map((row) => {
            return {
                ...row,
                filepath: `${this.config.get<string>('BASE_URL')}/transcription/audio/${row.filename}`,
                transcription: this.encryptService.decrypt(row.transcription)
            }
        })
        
        return note
    }

    async validateTranscription(ids: number[]) {
        if (!ids.length) return

        const count = await this.transcriptionRepository.count({
            where: { id: In(ids) },
        });

        if (count !== ids.length) {
            throw new BadRequestException('Invalid transcription ID');
        }
    }

    async updateTranscription(ids: number[], note: Note) {
        await this.transcriptionRepository
            .createQueryBuilder()
            .update()
            .set({ note: note })
            .whereInIds(ids)
            .execute();
    }

    @Transactional()
    async create(data: CreateNoteDto) {

        await this.validateTranscription(data.transcriptionIds)

        if(data.summary){
            data.summary = this.encryptService.encrypt(data.summary)
        }
        const note = this.repository.create(data);

        const savedNote = await this.repository.save(note);

        if (data.transcriptionIds?.length) {
            await this.updateTranscription(data.transcriptionIds, savedNote)
        }
        return savedNote;
    }

    @Transactional()
    async update(id: number, data: UpdateNoteDto) {

        const note = await this.findOne(id)

        if (data.title) note.title = data.title
        if (data.content) note.content = data.content

        const savedNote = await this.repository.save(note)

        if (data.transcriptionIds) {
            await this.validateTranscription(data.transcriptionIds)

            await this.transcriptionRepository
                .createQueryBuilder()
                .update()
                .set({ note: null })
                .where('noteId = :noteId', { noteId: id })
                .execute();

            await this.updateTranscription(data.transcriptionIds, savedNote)
        }

        return savedNote;
    }

    async delete(id: number){
        const item = await this.repository.findOne({ where: { id } })
        if (!item) {
            throw new NotFoundException('Note not found')
        }
        return this.repository.delete(id)
    }
}