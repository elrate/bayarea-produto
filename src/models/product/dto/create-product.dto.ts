import { IsString, IsInt, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  brand: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  description: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  supplier: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  productCode: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  category: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  unitOfMeasure: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNotEmpty()
  @IsInt()
  fiscalRegistration: number;
}
