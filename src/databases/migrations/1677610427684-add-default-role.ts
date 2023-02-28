import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDefaultRole1677610427684 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'`);
  }

  public async down(_: QueryRunner): Promise<void> {
    //
  }
}
