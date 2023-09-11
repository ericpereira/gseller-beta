import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedMultivendor1687564786282 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "seller" ADD "customFieldsConnectedaccountid" character varying(255)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "seller" DROP COLUMN "customFieldsConnectedaccountid"`, undefined);
   }

}
