import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
        // If parent_id is provided, verify it exists and belongs to user
        if (createCategoryDto.parent_id) {
            const parentCategory = await this.categoriesRepository.findOne({
                where: { id: createCategoryDto.parent_id, user: { id: user.id } },
            });

            if (!parentCategory) {
                throw new NotFoundException('Parent category not found or does not belong to user');
            }
        }

        const category = this.categoriesRepository.create({
            ...createCategoryDto,
            user,
        });
        return this.categoriesRepository.save(category);
    }

    async findAll(user: User): Promise<Category[]> {
        return this.categoriesRepository.find({
            where: { user: { id: user.id } },
            relations: ['parent', 'children'],
        });
    }

    async getCategoryTree(user: User): Promise<Category[]> {
        const categories = await this.categoriesRepository.find({
            where: { user: { id: user.id } },
            order: { id: 'ASC' }
        });

        return this.buildTree(categories);
    }

    private buildTree(categories: Category[]): Category[] {
        const categoryMap = new Map<number, Category>();
        const rootCategories: Category[] = [];


        // First pass: create map of all categories
        categories.forEach(cat => {
            categoryMap.set(cat.id, { ...cat, children: [] });
        });

        // Second pass: build tree structure
        categories.forEach(cat => {
            const category = categoryMap.get(cat.id);
            if (category) {
                if (cat.parent_id) {
                    const parent = categoryMap.get(cat.parent_id);
                    if (parent) {
                        parent.children.push(category);
                    }
                } else {
                    rootCategories.push(category);
                }
            }
        });

        return rootCategories;
    }

    async findOne(id: number, user: User): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { id, user: { id: user.id } },
            relations: ['parent', 'children'],
        });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto, user: User): Promise<Category> {
        const category = await this.findOne(id, user);

        // If updating parent_id, verify new parent exists and prevent circular reference
        if (updateCategoryDto.parent_id !== undefined) {
            if (updateCategoryDto.parent_id === id) {
                throw new BadRequestException('Category cannot be its own parent');
            }

            if (updateCategoryDto.parent_id) {
                const parentCategory = await this.categoriesRepository.findOne({
                    where: { id: updateCategoryDto.parent_id, user: { id: user.id } },
                });

                if (!parentCategory) {
                    throw new NotFoundException('Parent category not found or does not belong to user');
                }

                // Check for circular reference (if new parent is a descendant of current category)
                const isCircular = await this.isDescendant(id, updateCategoryDto.parent_id);
                if (isCircular) {
                    throw new BadRequestException('Cannot create circular parent-child relationship');
                }
            }
        }

        Object.assign(category, updateCategoryDto);
        return this.categoriesRepository.save(category);
    }

    private async isDescendant(ancestorId: number, descendantId: number): Promise<boolean> {
        const descendant = await this.categoriesRepository.findOne({
            where: { id: descendantId },
            relations: ['parent'],
        });

        if (!descendant || !descendant.parent_id) {
            return false;
        }

        if (descendant.parent_id === ancestorId) {
            return true;
        }

        return this.isDescendant(ancestorId, descendant.parent_id);
    }

    async remove(id: number, user: User): Promise<void> {
        const category = await this.findOne(id, user);
        await this.categoriesRepository.remove(category);
    }
}
