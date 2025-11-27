import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsOptional()
    parent_id?: number;
}
