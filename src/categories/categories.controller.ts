import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
        return this.categoriesService.create(createCategoryDto, req.user);
    }

    @Get()
    findAll(@Request() req) {
        return this.categoriesService.findAll(req.user);
    }

    @Get('tree')
    getCategoryTree(@Request() req) {
        return this.categoriesService.getCategoryTree(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.categoriesService.findOne(+id, req.user);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Request() req) {
        return this.categoriesService.update(+id, updateCategoryDto, req.user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.categoriesService.remove(+id, req.user);
    }
}
