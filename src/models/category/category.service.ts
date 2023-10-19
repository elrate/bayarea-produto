import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entitie/category';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async getCategoryByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { name } });
    if (!category) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }
    return category;
  }

  async createCategory(category: Category): Promise<Category> {
    return await this.categoryRepository.save(category);
  }

  async updateCategory(
    id: number,
    updatedCategory: Category,
  ): Promise<Category> {
    const existingCategory = await this.getCategoryById(id);
    // Atualiza as propriedades da categoria existente com os valores fornecidos
    this.categoryRepository.merge(existingCategory, updatedCategory);
    return await this.categoryRepository.save(existingCategory);
  }

  async deleteCategory(id: number): Promise<void> {
    const existingCategory = await this.getCategoryById(id);
    await this.categoryRepository.remove(existingCategory);
  }
}
