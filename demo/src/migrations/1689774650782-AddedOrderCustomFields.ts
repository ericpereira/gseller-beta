import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedOrderCustomFields1689774650782 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsPagarmeorderid" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsPagarmemetadata" text`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsPagarmeqrcode" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsPagarmeboletourl" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsPagarmepaymenttype" character varying(255)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsPagarmepaymenttype"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsPagarmeboletourl"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsPagarmeqrcode"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsPagarmemetadata"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsPagarmeorderid"`, undefined);
   }

}
