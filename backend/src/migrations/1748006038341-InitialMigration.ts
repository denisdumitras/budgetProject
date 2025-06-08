import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1748006038341 implements MigrationInterface {
    name = 'InitialMigration1748006038341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "category" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "category" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "description" SET NOT NULL`);
    }

}
