import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { NoteService } from "./note.service";
import { PaginationQueryDTO } from "src/share/dto";
import { CreateNoteDto, UpdateNoteDto } from "./note.dto";

@Controller('note')
export class NoteController {
    constructor(
        private readonly service: NoteService
    ) { }

    @Get()
    getAll(
        @Query() query: PaginationQueryDTO
    ) {
        return this.service.findAll(query.page, query.limit, query.search)
    }

    @Get(':id')
    get(
        @Param('id') id: number
    ){
        return this.service.findOne(id, true)
    }

    @Post()
    create(
        @Body() body: CreateNoteDto
    ){
        return this.service.create(body)
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() body: UpdateNoteDto
    ){
        return this.service.update(id, body)
    }


    @Delete(':id')
    delete(
        @Param('id') id: number
    ){
        return this.service.delete(id)
    }
}