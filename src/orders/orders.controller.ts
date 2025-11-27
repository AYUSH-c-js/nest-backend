import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('checkout')
    checkout(@Request() req, @Body() checkoutDto: CheckoutDto) {
        return this.ordersService.checkout(req.user.id, checkoutDto);
    }

    @Get()
    getOrders(@Request() req) {
        return this.ordersService.getOrders(req.user.id);
    }

    @Get(':id')
    getOrderById(@Request() req, @Param('id') id: string) {
        return this.ordersService.getOrderById(req.user.id, +id);
    }

    @Patch(':id/status')
    updateOrderStatus(
        @Param('id') id: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateOrderStatus(+id, updateOrderStatusDto.status);
    }

    @Post(':id/cancel')
    cancelOrder(@Request() req, @Param('id') id: string) {
        return this.ordersService.cancelOrder(req.user.UpdateCartItemDto, +id);
    }
}
