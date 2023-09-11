import {MigrationInterface, QueryRunner} from "typeorm";

export class relationChannelAddress1690296139724 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_address" DROP COLUMN "channelId"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_address" ADD "channelId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_address" ADD CONSTRAINT "FK_1d33c1df7dfc9aa7f7980aabcb2" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_address" DROP CONSTRAINT "FK_1d33c1df7dfc9aa7f7980aabcb2"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_address" DROP COLUMN "channelId"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_address" ADD "channelId" character varying NOT NULL DEFAULT ''`, undefined);
   }

}
