import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CartService } from '../cart/cart.service';
import { InvoiceService } from './services/invoice.service';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderStatus } from './enums/order.enums';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private cartService: CartService,
        private invoiceService: InvoiceService,
        private dataSource: DataSource,
    ) { }

    async checkout(userId: number, checkoutDto: CheckoutDto) {
        // Get cart with items
        const { cart, summary } = await this.cartService.getCart(userId);

        if (!cart.items || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // Start transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Check stock availability and reduce stock
            for (const cartItem of cart.items) {
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: cartItem.product_id },
                });

                if (!product) {
                    throw new NotFoundException(`Product ${cartItem.product_id} not found`);
                }

                if (product.stock < cartItem.quantity) {
                    throw new BadRequestException(
                        `Insufficient stock for ${product.name}. Only ${product.stock} available`,
                    );
                }

                // Reduce stock
                product.stock -= cartItem.quantity;
                await queryRunner.manager.save(product);
            }

            // Generate order number
            const orderNumber = `ORD-${Date.now()}-${userId}`;

            // Create order
            const order = queryRunner.manager.create(Order, {
                user_id: userId,
                order_number: orderNumber,
                payment_method: checkoutDto.payment_method,
                payment_status: false,
                subtotal: parseFloat(summary.subtotal),
                tax: parseFloat(summary.tax),
                discount: parseFloat(summary.discount),
                total: parseFloat(summary.total),
                shipping_address: checkoutDto.shipping_address,
                phone: checkoutDto.phone,
                status: OrderStatus.PENDING,
            });

            const savedOrder = await queryRunner.manager.save(order);

            // Create order items
            const orderItems = cart.items.map((cartItem) => {
                const itemTotal = Number(cartItem.product.price) * cartItem.quantity;
                return queryRunner.manager.create(OrderItem, {
                    order_id: savedOrder.id,
                    product_id: cartItem.product_id,
                    product_name: cartItem.product.name,
                    price: cartItem.product.price,
                    quantity: cartItem.quantity,
                    total: itemTotal,
                });
            });

            await queryRunner.manager.save(orderItems);

            // Clear cart
            await this.cartService.clearCart(userId);

            // Commit transaction
            await queryRunner.commitTransaction();

            // Get complete order with relations
            const completeOrder = await this.orderRepository.findOne({
                where: { id: savedOrder.id },
                relations: ['items', 'user'],
            });

            if (!completeOrder) {
                throw new NotFoundException('Order not found after creation');
            }

            // Generate invoice
            try {
                const invoicePath = await this.invoiceService.generateInvoice(completeOrder);
                completeOrder.invoice_path = invoicePath;
                await this.orderRepository.save(completeOrder);
            } catch (error) {
                console.error('Invoice generation failed:', error);
                // Don't fail the order if invoice generation fails
            }

            return {
                message: 'Order placed successfully',
                order: completeOrder,
                invoice_url: completeOrder.invoice_path
                    ? `/invoices/invoice-${completeOrder.order_number}.pdf`
                    : null,
            };
        } catch (error) {
            // Rollback transaction on error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }

    async getOrders(userId: number) {
        const orders = await this.orderRepository.find({
            where: { user_id: userId },
            relations: ['items'],
            order: { created_at: 'DESC' },
        });

        return orders;
    }

    async getOrderById(userId: number, orderId: number) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId, user_id: userId },
            relations: ['items', 'items.product', 'user'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return {
            ...order,
            invoice_url: order.invoice_path
                ? `/invoices/invoice-${order.order_number}.pdf`
                : null,
        };
    }

    async updateOrderStatus(orderId: number, status: OrderStatus) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.status = status;

        if (status === OrderStatus.PAID) {
            order.payment_status = true;
        }

        await this.orderRepository.save(order);

        return {
            message: 'Order status updated successfully',
            order,
        };
    }

    async cancelOrder(userId: number, orderId: number) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId, user_id: userId },
            relations: ['items'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.COMPLETED) {
            throw new BadRequestException('Cannot cancel order that has been shipped or completed');
        }

        if (order.status === OrderStatus.CANCELLED) {
            throw new BadRequestException('Order is already cancelled');
        }

        // Start transaction to restore stock
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Restore stock for each item
            for (const orderItem of order.items) {
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: orderItem.product_id },
                });

                if (product) {
                    product.stock += orderItem.quantity;
                    await queryRunner.manager.save(product);
                }
            }

            // Update order status
            order.status = OrderStatus.CANCELLED;
            await queryRunner.manager.save(order);

            await queryRunner.commitTransaction();

            return {
                message: 'Order cancelled successfully',
                order,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
