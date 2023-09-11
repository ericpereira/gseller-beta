import {MigrationInterface, QueryRunner} from "typeorm";

export class migrations1694462951213 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_47b012f4fa1cda466a854209f09"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_f448a72a2326b03b66d9df059fe"`, undefined);
        await queryRunner.query(`ALTER TABLE "seller" DROP COLUMN "customFieldsConnectedaccountid"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "customFieldsLogoid"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "customFields__fix_relational_custom_fields__"`, undefined);
        await queryRunner.query(`ALTER TABLE "administrator" DROP COLUMN "customFieldsConnectedaccountid"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsHeight"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsWidth"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsLength"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsWeight"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsPagarmeqrcode"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsPagarmeboletourl"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsPagarmepaymenttype"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsPagarmeorderid"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsPagarmemetadata"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "customFieldsAvatarid"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "customFields__fix_relational_custom_fields__"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customFieldsNumber"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customFieldsNeighborhood"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "address" ADD "customFieldsNeighborhood" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "customFieldsNumber" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" ADD "customFields__fix_relational_custom_fields__" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" ADD "customFieldsAvatarid" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsPagarmemetadata" text`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsPagarmeorderid" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsPagarmepaymenttype" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsPagarmeboletourl" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsPagarmeqrcode" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsWeight" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsLength" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsWidth" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsHeight" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "administrator" ADD "customFieldsConnectedaccountid" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD "customFields__fix_relational_custom_fields__" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD "customFieldsLogoid" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "seller" ADD "customFieldsConnectedaccountid" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_f448a72a2326b03b66d9df059fe" FOREIGN KEY ("customFieldsAvatarid") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_47b012f4fa1cda466a854209f09" FOREIGN KEY ("customFieldsLogoid") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

}
