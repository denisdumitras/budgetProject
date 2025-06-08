import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1745062695996 implements MigrationInterface {
    name = 'InitialMigration1745062695996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "description" character varying NOT NULL, "category" character varying, "importance" character varying, "date" TIMESTAMP NOT NULL, "source" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "expense"`);
    }

}
