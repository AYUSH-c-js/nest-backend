import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CartModule } from '../cart/cart.module';
import { InvoiceService } from './services/invoice.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Product, User]),
        CartModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService, InvoiceService],
    exports: [OrdersService],
})
export class OrdersModule { }
