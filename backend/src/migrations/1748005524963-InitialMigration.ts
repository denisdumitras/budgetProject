import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1748005524963 implements MigrationInterface {
    name = 'InitialMigration1748005524963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" RENAME COLUMN "source" TO "location"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" RENAME COLUMN "location" TO "source"`);
    }

}
