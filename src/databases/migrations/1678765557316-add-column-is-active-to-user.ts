import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnIsActiveToUser1678765557316 implements MigrationInterface {
  name = 'addColumnIsActiveToUser1678765557316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "users" ADD "verify_token" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verify_token"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
  }
}
