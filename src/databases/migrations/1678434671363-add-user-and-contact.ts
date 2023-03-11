import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserAndContact1678434671363 implements MigrationInterface {
  name = 'addUserAndContact1678434671363';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."contacts_status_enum" AS ENUM('ACTIVE', 'PENDING', 'BLOCKED')`);
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."contacts_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "contact_id" uuid, "user_id" uuid, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contacts" ADD CONSTRAINT "FK_b85c417d6af2e06ff6ba8c8234d" FOREIGN KEY ("contact_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contacts" ADD CONSTRAINT "FK_af0a71ac1879b584f255c49c99a" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_af0a71ac1879b584f255c49c99a"`);
    await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_b85c417d6af2e06ff6ba8c8234d"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TYPE "public"."contacts_status_enum"`);
  }
}
