import { Category } from 'src/models/category/entitie/category';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  codigo: number;

  @Column()
  name: string;

  @Column({ name: 'category_id' })
  idCategory: number;

  @Column()
  unidade_de_medida: string;

  @Column()
  price: number;

  @Column()
  registro_fiscal: string;

  @ManyToOne(() => Category, (category: Category) => category.products)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: Category;
}
