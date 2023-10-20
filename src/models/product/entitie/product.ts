import { Category } from 'src/models/category/entitie/category';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryColumn()
  codigo: number;

  @Column()
  name: string;

  @Column({ name: 'id_category' })
  idCategory: number;

  @Column()
  unidade_de_medida: string;

  @Column()
  price: number;

  @Column()
  registro_fiscal: string;

  @ManyToOne(() => Category, (category: Category) => category.products)
  @JoinColumn({ name: 'id_category', referencedColumnName: 'id' })
  category?: Category;
}
