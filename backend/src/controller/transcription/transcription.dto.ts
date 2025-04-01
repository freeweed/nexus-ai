import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";

export class SummarizeBodyDTO {
    @IsNotEmpty()
    text: string
}