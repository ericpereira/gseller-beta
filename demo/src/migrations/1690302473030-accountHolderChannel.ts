import {MigrationInterface, QueryRunner} from "typeorm";

export class accountHolderChannel1690302473030 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account_holder" DROP COLUMN "channelId"`, undefined);
        await queryRunner.query(`ALTER TABLE "account_holder" ADD "channelId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "account_holder" ADD CONSTRAINT "UQ_4be6b504ae2d290760b3284340e" UNIQUE ("channelId")`, undefined);
        await queryRunner.query(`ALTER TABLE "account_holder" ADD CONSTRAINT "FK_4be6b504ae2d290760b3284340e" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "account_holder" DROP CONSTRAINT "FK_4be6b504ae2d290760b3284340e"`, undefined);
        await queryRunner.query(`ALTER TABLE "account_holder" DROP CONSTRAINT "UQ_4be6b504ae2d290760b3284340e"`, undefined);
        await queryRunner.query(`ALTER TABLE "account_holder" DROP COLUMN "channelId"`, undefined);
        await queryRunner.query(`ALTER TABLE "account_holder" ADD "channelId" character varying NOT NULL DEFAULT ''`, undefined);
   }

}
