import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNotifications1678547201930 implements MigrationInterface {
  name = 'addNotifications1678547201930';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3"`);
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_ae68ec8a387644818c8f7786f68"`);
    await queryRunner.query(`ALTER TABLE "message_document" DROP CONSTRAINT "FK_4a697815f859609a4c73c3a533c"`);
    await queryRunner.query(`ALTER TABLE "message_document" DROP CONSTRAINT "FK_bb78ad43bd3da85a519d3747950"`);
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('NEW_MESSAGE', 'ADD_FRIEND', 'FRIEND_ACCEPTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."notifications_type_enum" NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "title" character varying(100) NOT NULL, "content" character varying(200) NOT NULL, "meta_data" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "from_user_id" uuid, "to_user_id" uuid NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_44842273b97d2094bc2e3a31d4a" FOREIGN KEY ("from_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_a28a6b5c3c0f3cedfef35d6d6bf" FOREIGN KEY ("to_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3" FOREIGN KEY ("user_id") REFERENCES "chat_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_ae68ec8a387644818c8f7786f68" FOREIGN KEY ("chat_group_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_document" ADD CONSTRAINT "FK_bb78ad43bd3da85a519d3747950" FOREIGN KEY ("message_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_document" ADD CONSTRAINT "FK_4a697815f859609a4c73c3a533c" FOREIGN KEY ("document_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message_document" DROP CONSTRAINT "FK_4a697815f859609a4c73c3a533c"`);
    await queryRunner.query(`ALTER TABLE "message_document" DROP CONSTRAINT "FK_bb78ad43bd3da85a519d3747950"`);
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_ae68ec8a387644818c8f7786f68"`);
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_a28a6b5c3c0f3cedfef35d6d6bf"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_44842273b97d2094bc2e3a31d4a"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "message_document" ADD CONSTRAINT "FK_bb78ad43bd3da85a519d3747950" FOREIGN KEY ("message_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_document" ADD CONSTRAINT "FK_4a697815f859609a4c73c3a533c" FOREIGN KEY ("document_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_ae68ec8a387644818c8f7786f68" FOREIGN KEY ("chat_group_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3" FOREIGN KEY ("user_id") REFERENCES "chat_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
  }
}
