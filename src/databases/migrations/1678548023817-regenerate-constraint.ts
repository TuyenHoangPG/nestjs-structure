import { MigrationInterface, QueryRunner } from 'typeorm';

export class regenerateConstraint1678548023817 implements MigrationInterface {
  name = 'regenerateConstraint1678548023817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3"`);
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_ae68ec8a387644818c8f7786f68"`);
    await queryRunner.query(`ALTER TABLE "message_document" DROP CONSTRAINT "FK_bb78ad43bd3da85a519d3747950"`);
    await queryRunner.query(`ALTER TABLE "message_document" DROP CONSTRAINT "FK_4a697815f859609a4c73c3a533c"`);
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_chatgroupid_ChatGroups" FOREIGN KEY ("chat_group_id") REFERENCES "chat_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_userid_Users" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_document" ADD CONSTRAINT "FK_documentid_Documents" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_document" ADD CONSTRAINT "FK_messageid_Messages" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message_document" DROP CONSTRAINT "FK_messageid_Messages"`);
    await queryRunner.query(`ALTER TABLE "message_document" DROP CONSTRAINT "FK_documentid_Documents"`);
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_userid_Users"`);
    await queryRunner.query(`ALTER TABLE "user_chatgroup" DROP CONSTRAINT "FK_chatgroupid_ChatGroups"`);
    await queryRunner.query(
      `ALTER TABLE "message_document" ADD CONSTRAINT "FK_4a697815f859609a4c73c3a533c" FOREIGN KEY ("document_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_document" ADD CONSTRAINT "FK_bb78ad43bd3da85a519d3747950" FOREIGN KEY ("message_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_ae68ec8a387644818c8f7786f68" FOREIGN KEY ("chat_group_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chatgroup" ADD CONSTRAINT "FK_371a35c2217dfebd4b1e73df7f3" FOREIGN KEY ("user_id") REFERENCES "chat_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
  }
}
