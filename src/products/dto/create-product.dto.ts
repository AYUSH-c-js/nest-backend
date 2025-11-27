import { IsNotEmpty, IsString, IsNumber, IsArray, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(10)
    stock: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    category_ids: number[];
}
