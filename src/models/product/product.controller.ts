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
import { Product } from './entitie/product';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get(':codigo')
  async getProductByCodigo(@Param('codigo') codigo: number): Promise<Product> {
    return this.productService.getProductById(codigo);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() product: Product): Promise<Product> {
    return this.productService.createProduct(product);
  }

  @Put(':codigo')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('codigo') codigo: number,
    @Body() updatedProduct: Product,
  ): Promise<Product> {
    return this.productService.updateProduct(codigo, updatedProduct);
  }

  @Delete(':codigo')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('codigo') codigo: number): Promise<void> {
    return this.productService.deleteProduct(codigo);
  }
}
