import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductTable1675766852243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      CREATE TABLE product (
        codigo INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        id_category INTEGER NOT NULL,
        unidade_de_medida TEXT NOT NULL,
        price REAL NOT NULL,
        registro_fiscal TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DROP TABLE product;');
  }
}
