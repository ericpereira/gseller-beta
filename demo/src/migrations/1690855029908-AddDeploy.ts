import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDeploy1690855029908 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "public"."deploy_type_enum" AS ENUM('vercel', 'IOS', 'Android')`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."deploy_status_enum" AS ENUM('created', 'running', 'finished', 'error')`, undefined);
        await queryRunner.query(`CREATE TABLE "deploy" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."deploy_type_enum" NOT NULL DEFAULT 'vercel', "active" boolean NOT NULL DEFAULT true, "url" character varying NOT NULL, "status" "public"."deploy_status_enum" NOT NULL DEFAULT 'created', "metadata" text NOT NULL, "id" SERIAL NOT NULL, "vercelDeployId" integer, "channelId" integer, CONSTRAINT "PK_e515d996a39c08335939905ca2b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_2983af829999ca6ab2e2d1cc97" ON "deploy" ("channelId") `, undefined);
        await queryRunner.query(`ALTER TABLE "deploy" ADD CONSTRAINT "FK_4c36370d1fdab3b5d72257af67c" FOREIGN KEY ("vercelDeployId") REFERENCES "vercel_deploy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "deploy" ADD CONSTRAINT "FK_2983af829999ca6ab2e2d1cc978" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "deploy" DROP CONSTRAINT "FK_2983af829999ca6ab2e2d1cc978"`, undefined);
        await queryRunner.query(`ALTER TABLE "deploy" DROP CONSTRAINT "FK_4c36370d1fdab3b5d72257af67c"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_2983af829999ca6ab2e2d1cc97"`, undefined);
        await queryRunner.query(`DROP TABLE "deploy"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."deploy_status_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."deploy_type_enum"`, undefined);
   }

}
