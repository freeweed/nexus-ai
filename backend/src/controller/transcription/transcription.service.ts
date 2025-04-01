import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transcription } from "src/entities";
import { Repository } from "typeorm";
import { IUploadFile } from "./transaction.interface";
import { EncryptionService } from "src/share/service/encryption.service";
import { unlinkSync } from "fs";

@Injectable()
export class TranscriptionService {
    constructor(
        @InjectRepository(Transcription)
        private readonly repository: Repository<Transcription>,
        private readonly encryptionService: EncryptionService
    ) { }

    async findAll(page: number = 1, limit: number = 10) {
        const [items, total] = await this.repository.findAndCount({
            order: { created: 'DESC' }, // เรียงตามวันที่
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        const lastPage = totalPages === 0 ? 1 : totalPages

        return {
            items: items.map(row => {
                return {
                    ...row,
                    transcription: this.encryptionService.decrypt(row.transcription)
                }
            }),
            total,
            nextPage: lastPage !== page ? page + 1 : null,
            prevPage: page !== 1 ? page - 1 : null,
            lastPage,
            page
        };
    }

    create(data: IUploadFile) {
        let { transcription } = data
        transcription = this.encryptionService.encrypt(transcription)
        return this.repository.save({...data, transcription})
    }

    async delete(id: number) {
        const item = await this.repository.findOne({ where: { id } })
        if (!item) {
            throw new NotFoundException('Transcription not found')
        }
        unlinkSync(`./uploads/${item.filepath}`)
        return this.repository.delete(id)
    }
}