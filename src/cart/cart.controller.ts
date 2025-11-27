import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    getCart(@Request() req) {
        return this.cartService.getCart(req.user.userId);
    }

    @Post('add')
    addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
        return this.cartService.addToCart(req.user.id, addToCartDto);
    }

    @Patch('items/:id')
    updateCartItem(
        @Request() req,
        @Param('id') id: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
    ) {
        return this.cartService.updateCartItem(
            req.user.userId,
            +id,
            updateCartItemDto.quantity,
        );
    }

    @Delete('items/:id')
    removeCartItem(@Request() req, @Param('id') id: string) {
        return this.cartService.removeCartItem(req.user.userId, +id);
    }

    @Delete()
    clearCart(@Request() req) {
        return this.cartService.clearCart(req.user.userId);
    }
}
