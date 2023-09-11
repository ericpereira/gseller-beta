import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedAddressCustomFields1687529443967 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "address" ADD "customFieldsNumber" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD "customFieldsNeighborhood" character varying(255)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customFieldsNeighborhood"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customFieldsNumber"`, undefined);
   }

}
