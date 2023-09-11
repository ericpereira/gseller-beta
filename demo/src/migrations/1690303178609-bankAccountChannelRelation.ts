import {MigrationInterface, QueryRunner} from "typeorm";

export class bankAccountChannelRelation1690303178609 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_bank_account" DROP COLUMN "channelId"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_bank_account" ADD "channelId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_bank_account" ADD CONSTRAINT "UQ_af17c19fdbab38f03a435d73c04" UNIQUE ("channelId")`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_bank_account" ADD CONSTRAINT "FK_af17c19fdbab38f03a435d73c04" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_bank_account" DROP CONSTRAINT "FK_af17c19fdbab38f03a435d73c04"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_bank_account" DROP CONSTRAINT "UQ_af17c19fdbab38f03a435d73c04"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_bank_account" DROP COLUMN "channelId"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_bank_account" ADD "channelId" character varying NOT NULL DEFAULT ''`, undefined);
   }

}
