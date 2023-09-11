import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedChannelLogo1689686696475 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel" ADD "customFieldsLogoid" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD "customFields__fix_relational_custom_fields__" boolean`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "channel"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_bank_account" ALTER COLUMN "inAnalysis" SET DEFAULT true`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_47b012f4fa1cda466a854209f09" FOREIGN KEY ("customFieldsLogoid") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_47b012f4fa1cda466a854209f09"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_bank_account" ALTER COLUMN "inAnalysis" SET DEFAULT false`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "channel"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "customFields__fix_relational_custom_fields__"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "customFieldsLogoid"`, undefined);
   }

}
