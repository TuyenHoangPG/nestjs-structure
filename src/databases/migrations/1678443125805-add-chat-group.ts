import { MigrationInterface, QueryRunner } from 'typeorm';

export class addChatGroup1678443125805 implements MigrationInterface {
  name = 'addChatGroup1678443125805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "message_amount" integer NOT NULL DEFAULT '0', "member_amount" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_99f0cb8163569cd32e8a16cbc9f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_chatgroup" ("chat_group_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_819806b46d5a805c04c082ca442" PRIMARY KEY ("chat_group_id", "user_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_ae68ec8a387644818c8f7786f6" ON "user_chatgroup" ("chat_group_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_371a35c2217dfebd4b1e73df7f" ON "user_chatgroup" ("user_id") `);
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_ae68ec8a387644818c8f7786f68" FOREIGN KEY ("chat_group_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3" FOREIGN KEY ("user_id") REFERENCES "chat_groups"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3"`);
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_ae68ec8a387644818c8f7786f68"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_371a35c2217dfebd4b1e73df7f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ae68ec8a387644818c8f7786f6"`);
    await queryRunner.query(`DROP TABLE "user_chatgroup"`);
    await queryRunner.query(`DROP TABLE "chat_groups"`);
  }
}
