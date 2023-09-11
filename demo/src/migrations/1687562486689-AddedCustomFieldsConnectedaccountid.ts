import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedCustomFieldsConnectedaccountid1687562486689 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "administrator" ADD "customFieldsConnectedaccountid" character varying(255)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "administrator" DROP COLUMN "customFieldsConnectedaccountid"`, undefined);
   }

}
