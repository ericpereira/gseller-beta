import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedCustomerAvatar1687568242036 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "customFieldsAvatarid" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" ADD "customFields__fix_relational_custom_fields__" boolean`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "customer"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_f448a72a2326b03b66d9df059fe" FOREIGN KEY ("customFieldsAvatarid") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_f448a72a2326b03b66d9df059fe"`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "customer"."customFields__fix_relational_custom_fields__" IS 'A work-around needed when only relational custom fields are defined on an entity'`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "customFields__fix_relational_custom_fields__"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "customFieldsAvatarid"`, undefined);
   }

}
