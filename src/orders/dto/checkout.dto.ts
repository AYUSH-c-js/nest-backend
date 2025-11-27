import { IsEnum, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentMethod } from '../enums/order.enums';

export class CheckoutDto {
    @IsEnum(PaymentMethod)
    payment_method: PaymentMethod;

    @IsString()
    @IsNotEmpty()
    shipping_address: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
