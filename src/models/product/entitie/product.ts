import { Category } from 'src/models/category/entitie/category';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  description: string;

  @Column()
  supplier: string;

  @Column({ name: 'product_code' })
  productCode: string;

  @Column({ name: 'id_category' })
  idCategory: number;

  @Column({ name: 'unit_of_measure' })
  unitOfMeasure: string;

  @Column()
  price: number;

  @Column({ name: 'fiscal_registration' })
  fiscalRegistration: number;

  @ManyToOne(() => Category, (category: Category) => category.products)
  @JoinColumn({ name: 'id_category', referencedColumnName: 'id' })
  category?: Category;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
