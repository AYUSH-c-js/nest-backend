import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async getCart(userId: number) {
        let cart = await this.cartRepository.findOne({
            where: { user_id: userId },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            // Create cart if it doesn't exist
            cart = this.cartRepository.create({ user_id: userId });
            cart = await this.cartRepository.save(cart);
            cart.items = [];
        }

        // Calculate totals
        const subtotal = cart.items.reduce((sum, item) => {
            return sum + (Number(item.product.price) * item.quantity);
        }, 0);

        const tax = subtotal * 0.1; // 10% tax
        const discount = 0; // Can be implemented based on business logic
        const total = subtotal + tax - discount;

        return {
            cart,
            summary: {
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                discount: discount.toFixed(2),
                total: total.toFixed(2),
            },
        };
    }

    async addToCart(userId: number, addToCartDto: AddToCartDto) {
        const { product_id, quantity } = addToCartDto;

        // Check if product exists and has enough stock
        const product = await this.productRepository.findOne({
            where: { id: product_id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.stock < quantity) {
            throw new BadRequestException(`Insufficient stock. Only ${product.stock} items available`);
        }

        // Get or create cart
        let cart = await this.cartRepository.findOne({
            where: { user_id: userId },
            relations: ['items'],
        });

        if (!cart) {
            cart = this.cartRepository.create({ user_id: userId });
            cart = await this.cartRepository.save(cart);
        }

        // Check if product already in cart
        const existingItem = await this.cartItemRepository.findOne({
            where: { cart_id: cart.id, product_id },
        });

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;

            if (product.stock < newQuantity) {
                throw new BadRequestException(`Insufficient stock. Only ${product.stock} items available`);
            }

            existingItem.quantity = newQuantity;
            await this.cartItemRepository.save(existingItem);
        } else {
            // Add new item
            const cartItem = this.cartItemRepository.create({
                cart_id: cart.id,
                product_id,
                quantity,
            });
            await this.cartItemRepository.save(cartItem);
        }

        return this.getCart(userId);
    }

    async updateCartItem(userId: number, cartItemId: number, quantity: number) {
        const cart = await this.cartRepository.findOne({
            where: { user_id: userId },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = await this.cartItemRepository.findOne({
            where: { id: cartItemId, cart_id: cart.id },
            relations: ['product'],
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        if (cartItem.product.stock < quantity) {
            throw new BadRequestException(`Insufficient stock. Only ${cartItem.product.stock} items available`);
        }

        cartItem.quantity = quantity;
        await this.cartItemRepository.save(cartItem);

        return this.getCart(userId);
    }

    async removeCartItem(userId: number, cartItemId: number) {
        const cart = await this.cartRepository.findOne({
            where: { user_id: userId },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = await this.cartItemRepository.findOne({
            where: { id: cartItemId, cart_id: cart.id },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        await this.cartItemRepository.remove(cartItem);

        return this.getCart(userId);
    }

    async clearCart(userId: number) {
        const cart = await this.cartRepository.findOne({
            where: { user_id: userId },
            relations: ['items'],
        });

        if (cart && cart.items.length > 0) {
            await this.cartItemRepository.remove(cart.items);
        }

        return { message: 'Cart cleared successfully' };
    }
}
