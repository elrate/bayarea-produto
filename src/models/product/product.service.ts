import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entitie/product';
import { EntityManager, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { ReturnProductDto } from './dto/return-producto.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { validate } from 'class-validator';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService, // Injeção do serviço de categorias
    private readonly entityManager: EntityManager, // Injeção do EntityManager para transações
  ) {}

  async getAllProducts(): Promise<ReturnProductDto[]> {
    const products = await this.productRepository.find();
    const productsWithReturnDto = await Promise.all(
      products.map(async (product) => {
        const categoryName = await this.getCategoryName(product);
        return this.mapToReturnDto(product, categoryName);
      }),
    );
    return productsWithReturnDto;
  }

  async getProductById(id: number): Promise<ReturnProductDto> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const categoryName = await this.getCategoryName(product);
    return this.mapToReturnDto(product, categoryName);
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const errors = await validate(createProductDto);

    if (errors.length > 0) {
      // Se houver erros de validação, lance uma exceção com detalhes
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    // Verifique se a categoria associada ao produto existe
    let existingCategory = await this.categoryService.getCategoryByName(
      createProductDto.category,
    );
    // Verifique se já existe um produto com base em algumas colunas iguais
    const existingProduct = await this.productRepository.findOne({
      where: {
        name: createProductDto.name, // Verifique a coluna 'name' (ou outra que você desejar)
        brand: createProductDto.brand, // Verifique a coluna 'brand' (ou outra que você desejar)
      },
    });
    if (existingProduct) {
      // Se um produto com valores semelhantes já existe, lance uma exceção ou retorne uma mensagem de erro
      throw new HttpException(
        'Product with similar values already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const dateNow = new Date();
    if (!existingCategory) {
      // Se a categoria não existe, crie a categoria
      existingCategory = await this.categoryService.createCategory({
        name: createProductDto.category,
        id: null,
        created_at: dateNow,
      });
    }

    // Crie uma instância de Product
    const product = new Product();
    product.name = createProductDto.name;
    product.brand = createProductDto.brand;
    product.description = createProductDto.description;
    product.supplier = createProductDto.supplier;
    product.productCode = createProductDto.productCode;
    product.unitOfMeasure = createProductDto.unitOfMeasure;
    product.price = createProductDto.price;
    product.fiscalRegistration = createProductDto.fiscalRegistration;
    product.idCategory = existingCategory.id;
    product.created_at = dateNow;

    // Crie uma transação para garantir que a categoria e o produto sejam salvos ou nenhum deles seja salvo
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
    id: number,
    updatedProduct: CreateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    const errors = await validate(updatedProduct);

    if (errors.length > 0) {
      // Se houver erros de validação, lance uma exceção com detalhes
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    // Verifique se o nome ou a marca do produto estão sendo atualizados
    if (
      updatedProduct.name !== existingProduct.name ||
      updatedProduct.brand !== existingProduct.brand
    ) {
      // Verifique se já existe um produto com a mesma combinação de nome e marca
      const veirificationProduct = await this.productRepository.findOne({
        where: {
          name: updatedProduct.name,
          brand: updatedProduct.brand,
        },
      });

      if (veirificationProduct) {
        // Se um produto com a mesma combinação de nome e marca já existe, lance uma exceção ou retorne uma mensagem de erro
        throw new HttpException(
          'Product with similar values already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const dateNow = new Date();
    let existingCategory = await this.categoryService.getCategoryByName(
      updatedProduct.category,
    );
    if (!existingCategory) {
      existingCategory = await this.categoryService.createCategory({
        name: updatedProduct.category,
        id: null,
        created_at: dateNow,
      });
    }
    existingProduct.name = updatedProduct.name;
    existingProduct.brand = updatedProduct.brand;
    existingProduct.description = updatedProduct.description;
    existingProduct.supplier = updatedProduct.supplier;
    existingProduct.productCode = updatedProduct.productCode;
    existingProduct.unitOfMeasure = updatedProduct.unitOfMeasure;
    existingProduct.price = updatedProduct.price;
    existingProduct.fiscalRegistration = updatedProduct.fiscalRegistration;
    existingProduct.idCategory = existingCategory.id;
    existingProduct.created_at = dateNow;
    return await this.productRepository.save(existingProduct);
  }

  async deleteProduct(id: number): Promise<void> {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.productRepository.remove(existingProduct);
  }

  private async mapToReturnDto(
    product: Product,
    categoryName: string,
  ): Promise<ReturnProductDto> {
    const returnDto: ReturnProductDto = {
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      unitOfMeasure: product.unitOfMeasure,
      fiscalRegistration: product.fiscalRegistration,
      supplier: product.supplier,
      productCode: product.productCode,
      category: categoryName,
    };

    return returnDto;
  }

  private async getCategoryName(product: Product): Promise<string> {
    const category = await this.categoryService.getCategoryById(
      product.idCategory,
    );
    return category.name;
  }
}
