import { IsInt, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
    @IsInt()
    @IsPositive()
    product_id: number;

    user_id: number;

    @IsInt()
    @Min(1)
    quantity: number;
}
