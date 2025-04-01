import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsObject, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsArray()
  content: Array<Record<string, any>>

  @IsOptional()
  @IsString()
  summary: string

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  transcriptionIds?: number[]
}

export class UpdateNoteDto{
    @IsOptional()
    @IsString()
    title?: string

    @IsOptional()
    @IsArray()
    content?: Array<Record<string, any>>

    @IsOptional()
    @IsString()
    summary: string
    
    @IsOptional()
    @IsArray()
    @Type(() => Number)
    @IsInt({ each: true })
    transcriptionIds?: number[]
}