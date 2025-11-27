import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async create(createProductDto: CreateProductDto, user: User): Promise<Product> {
        // Verify all categories exist and belong to user
        const categories = await this.categoriesRepository.find({
            where: {
                id: In(createProductDto.category_ids),
                user: { id: user.id }
            },
        });

        if (categories.length !== createProductDto.category_ids.length) {
            throw new NotFoundException('One or more categories not found or do not belong to user');
        }

        const product = this.productsRepository.create({
            name: createProductDto.name,
            price: createProductDto.price,
            description: createProductDto.description,
            stock: createProductDto.stock,
            user,
            categories,
        });
        return this.productsRepository.save(product);
    }

    async findAll(user: User): Promise<Product[]> {
        return this.productsRepository.find({
            where: { user: { id: user.id } },
            relations: ['categories'],
        });
    }

    async findOne(id: number, user: User): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { id, user: { id: user.id } },
            relations: ['categories'],
        });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto, user: User): Promise<Product> {
        const product = await this.findOne(id, user);

        if (updateProductDto.category_ids) {
            // Verify all categories exist and belong to user
            const categories = await this.categoriesRepository.find({
                where: {
                    id: In(updateProductDto.category_ids),
                    user: { id: user.id }
                },
            });

            if (categories.length !== updateProductDto.category_ids.length) {
                throw new NotFoundException('One or more categories not found or do not belong to user');
            }

            product.categories = categories;
        }

        // Update other fields
        if (updateProductDto.name !== undefined) {
            product.name = updateProductDto.name;
        }
        if (updateProductDto.price !== undefined) {
            product.price = updateProductDto.price;
        }
        if (updateProductDto.description !== undefined) {
            product.description = updateProductDto.description;
        }

        return this.productsRepository.save(product);
    }

    async remove(id: number, user: User): Promise<void> {
        const product = await this.findOne(id, user);
        await this.productsRepository.remove(product);
    }
}
