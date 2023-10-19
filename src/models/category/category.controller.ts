import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { Category } from './entitie/category';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    const categories = await this.categoryService.getAllCategories();
    return categories;
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number): Promise<Category> {
    const category = await this.categoryService.getCategoryById(id);
    return category;
  }

  @Get('name/:name')
  async getCategoryByName(@Param('name') name: string): Promise<Category> {
    const category = await this.categoryService.getCategoryByName(name);
    return category;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() category: Category): Promise<Category> {
    const createdCategory = await this.categoryService.createCategory(category);
    return createdCategory;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateCategory(
    @Param('id') id: number,
    @Body() updatedCategory: Category,
  ): Promise<Category> {
    const updated = await this.categoryService.updateCategory(
      id,
      updatedCategory,
    );
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: number): Promise<void> {
    await this.categoryService.deleteCategory(id);
  }
}
