import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedEntitiesChannelSocialMedia1688917804342 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "channel_social_media" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "nome" character varying NOT NULL, "link" character varying NOT NULL, "channelId" character varying NOT NULL DEFAULT '', "id" SERIAL NOT NULL, CONSTRAINT "PK_bb2044bb171adf7b334f28d895b" PRIMARY KEY ("id")); COMMENT ON COLUMN "channel_social_media"."deletedAt" IS 'The date & time at which the entity was soft-deleted'; COMMENT ON COLUMN "channel_social_media"."nome" IS 'The name of the social media'; COMMENT ON COLUMN "channel_social_media"."link" IS 'The link of the social media'`, undefined);
        await queryRunner.query(`CREATE INDEX "idx_channel_social_media_channel_id" ON "channel_social_media" ("channelId") `, undefined);
        await queryRunner.query(`CREATE INDEX "idx_channel_social_media_nome" ON "channel_social_media" ("nome") `, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "public"."idx_channel_social_media_nome"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."idx_channel_social_media_channel_id"`, undefined);
        await queryRunner.query(`DROP TABLE "channel_social_media"`, undefined);
   }

}
