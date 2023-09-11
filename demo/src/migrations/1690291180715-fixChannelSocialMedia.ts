import {MigrationInterface, QueryRunner} from "typeorm";

export class fixChannelSocialMedia1690291180715 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "public"."idx_channel_social_media_channel_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_social_media" DROP COLUMN "channelId"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_social_media" ADD "channelId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_social_media" ADD CONSTRAINT "FK_843324ebdbe5dd33141fa80d721" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_social_media" DROP CONSTRAINT "FK_843324ebdbe5dd33141fa80d721"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_social_media" DROP COLUMN "channelId"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_social_media" ADD "channelId" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`CREATE INDEX "idx_channel_social_media_channel_id" ON "channel_social_media" ("channelId") `, undefined);
   }

}
