import {MigrationInterface, QueryRunner} from "typeorm";

export class AddChannelBanner1691007958103 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "channel_banner" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying, "description" character varying, "link" character varying, "startAt" TIMESTAMP NOT NULL DEFAULT now(), "endAt" TIMESTAMP, "active" boolean NOT NULL DEFAULT true, "assetId" integer NOT NULL, "id" SERIAL NOT NULL, "channelId" integer, CONSTRAINT "PK_1a7cb7e453917621c880088d367" PRIMARY KEY ("id")); COMMENT ON COLUMN "channel_banner"."title" IS 'The title of the banner'; COMMENT ON COLUMN "channel_banner"."description" IS 'The description of the banner'; COMMENT ON COLUMN "channel_banner"."link" IS 'The link to the banner'; COMMENT ON COLUMN "channel_banner"."startAt" IS 'The date & time at which the entity was soft-deleted'; COMMENT ON COLUMN "channel_banner"."endAt" IS 'The date & time at which the entity was soft-deleted'; COMMENT ON COLUMN "channel_banner"."active" IS 'Whether the banner is active or not'`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_banner" ADD CONSTRAINT "FK_1fcce26244579d36c53591e9e0c" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_banner" ADD CONSTRAINT "FK_eef558a317a1c10e300cf3a3a52" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_banner" DROP CONSTRAINT "FK_eef558a317a1c10e300cf3a3a52"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_banner" DROP CONSTRAINT "FK_1fcce26244579d36c53591e9e0c"`, undefined);
        await queryRunner.query(`DROP TABLE "channel_banner"`, undefined);
   }

}
