import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateChannelAddress1688853374371 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_address" ADD "neighborhood" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_address" ADD "number" character varying NOT NULL DEFAULT ''`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_address" DROP COLUMN "number"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_address" DROP COLUMN "neighborhood"`, undefined);
   }

}
