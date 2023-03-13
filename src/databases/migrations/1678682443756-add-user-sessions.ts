import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserSessions1678682443756 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // This query following https://github.com/voxpelli/node-connect-pg-simple/blob/main/table.sql
    await queryRunner.query(`
        CREATE TABLE "user_sessions" (
            "sid" varchar NOT NULL COLLATE "default",
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL
          )
          WITH (OIDS=FALSE);
    `);
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_session_expire" ON "user_sessions" ("expire");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_sessions"`);
    await queryRunner.query(`DROP INDEX "IDX_session_expire"`);
  }
}
