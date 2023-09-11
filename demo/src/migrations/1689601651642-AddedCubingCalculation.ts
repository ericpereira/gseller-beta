import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedCubingCalculation1689601651642 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsHeight" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsWidth" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsLength" character varying(255)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsLength"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsWidth"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsHeight"`, undefined);
   }

}
