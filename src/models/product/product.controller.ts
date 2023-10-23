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
import { ReturnProductDto } from './dto/return-producto.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<ReturnProductDto[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductByCodigo(
    @Param('id') codigo: number,
  ): Promise<ReturnProductDto> {
    return this.productService.getProductById(codigo);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() product: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(product);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: number,
    @Body() updatedProduct: CreateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updatedProduct);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
