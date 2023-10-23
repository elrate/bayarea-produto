import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductTable1675766852243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      CREATE TABLE product (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        description TEXT NOT NULL,
        supplier TEXT NOT NULL,
        product_code TEXT NOT NULL,
        id_category INTEGER NOT NULL,
        unit_of_measure TEXT NOT NULL,
        price REAL NOT NULL,
        fiscal_registration INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DROP TABLE product;');
  }
}
