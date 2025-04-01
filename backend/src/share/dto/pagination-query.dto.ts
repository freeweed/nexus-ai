import { Type } from "class-transformer"
import { IsInt, IsOptional, Min } from "class-validator"

export class PaginationQueryDTO {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 1

    @IsOptional()
    search?: string;
}