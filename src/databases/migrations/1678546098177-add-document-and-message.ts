import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDocumentAndMessage1678546098177 implements MigrationInterface {
  name = 'addDocumentAndMessage1678546098177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3"`);
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_ae68ec8a387644818c8f7786f68"`);
    await queryRunner.query(`CREATE TYPE "public"."messages_type_enum" AS ENUM('TEXT', 'IMAGE', 'FILE', 'TEXT_IMAGE')`);
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying, "type" "public"."messages_type_enum" NOT NULL, "meta_data" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sender_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "description" character varying(1000), "document_type" character varying NOT NULL, "document_path" character varying NOT NULL, "document_size" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_document" ("document_id" uuid NOT NULL, "message_id" uuid NOT NULL, CONSTRAINT "PK_f981ddd8e593ec7c117791c731a" PRIMARY KEY ("document_id", "message_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_4a697815f859609a4c73c3a533" ON "message_document" ("document_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_bb78ad43bd3da85a519d374795" ON "message_document" ("message_id") `);
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_b561864743d235f44e70addc1f5" FOREIGN KEY ("receiver_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3" FOREIGN KEY ("user_id") REFERENCES "chat_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_ae68ec8a387644818c8f7786f68" FOREIGN KEY ("chat_group_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_document" ADD CONSTRAINT "FK_4a697815f859609a4c73c3a533c" FOREIGN KEY ("document_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_document" ADD CONSTRAINT "FK_bb78ad43bd3da85a519d3747950" FOREIGN KEY ("message_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message_document" DROP CONSTRAINT "FK_bb78ad43bd3da85a519d3747950"`);
    await queryRunner.query(`ALTER TABLE "message_document" DROP CONSTRAINT "FK_4a697815f859609a4c73c3a533c"`);
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_ae68ec8a387644818c8f7786f68"`);
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b561864743d235f44e70addc1f5"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bb78ad43bd3da85a519d374795"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4a697815f859609a4c73c3a533"`);
    await queryRunner.query(`DROP TABLE "message_document"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TYPE "public"."messages_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_ae68ec8a387644818c8f7786f68" FOREIGN KEY ("chat_group_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3" FOREIGN KEY ("user_id") REFERENCES "chat_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
  }
}
