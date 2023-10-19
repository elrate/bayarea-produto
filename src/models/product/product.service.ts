import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entitie/product';
import { EntityManager, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService, // Injeção do serviço de categorias
    private readonly entityManager: EntityManager, // Injeção do EntityManager para transações
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async getProductById(codigo: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { codigo } });
    if (!product) {
      throw new NotFoundException(`Product with Codigo ${codigo} not found`);
    }
    return product;
  }

  async createProduct(product: Product): Promise<Product> {
    // Verifica se a categoria associada ao produto existe
    const category = await this.categoryService.getCategoryById(
      product.idCategory,
    );
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${product.idCategory} not found`,
      );
    }
    // Cria uma transação para garantir que a categoria e o produto sejam salvos ou nenhum deles seja salvo
    return this.entityManager
      .transaction(async (transactionalEntityManager) => {
        const createdProduct = await transactionalEntityManager.save(
          Product,
          product,
        );
        return createdProduct;
      })
      .catch(() => {
        throw new BadRequestException('Failed to create the product');
      });
  }

  async updateProduct(
    codigo: number,
    updatedProduct: Product,
  ): Promise<Product> {
    const existingProduct = await this.getProductById(codigo);
    this.productRepository.merge(existingProduct, updatedProduct);
    return await this.productRepository.save(existingProduct);
  }

  async deleteProduct(codigo: number): Promise<void> {
    const existingProduct = await this.getProductById(codigo);
    await this.productRepository.remove(existingProduct);
  }
}
