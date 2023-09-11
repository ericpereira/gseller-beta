import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedFixchannelSocialMedia1689280617222 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_social_media" ALTER COLUMN "nome" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_social_media" ALTER COLUMN "link" DROP NOT NULL`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_social_media" ALTER COLUMN "link" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_social_media" ALTER COLUMN "nome" SET NOT NULL`, undefined);
   }

}
