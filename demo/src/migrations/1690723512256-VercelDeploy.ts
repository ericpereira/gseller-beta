import {MigrationInterface, QueryRunner} from "typeorm";

export class VercelDeploy1690723512256 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "vercel_deploy" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deployId" character varying, "payloadAlias" json, "aliasAssigned" boolean NOT NULL, "aliasError" character varying, "creatorUid" character varying, "creatorUsername" character varying, "creatorEmail" character varying, "vercelId" character varying, "name" character varying, "meta" json, "public" boolean, "readyState" character varying, "regions" json, "status" character varying, "teamId" character varying, "teamName" character varying, "teamSlug" character varying, "type" character varying, "url" character varying, "version" integer, "builds" json, "ownerId" character varying, "plan" character varying, "target" character varying, "inspectorUrl" character varying, "id" SERIAL NOT NULL, CONSTRAINT "PK_7e560343abc50328c84fd782d75" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_34ac15a21679b1714611fbf7d4" ON "vercel_deploy" ("creatorUid") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a6c9c754784fc1567b1e0cbf39" ON "vercel_deploy" ("creatorUsername") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a3c9b42125104dd40ac80a35a8" ON "vercel_deploy" ("creatorEmail") `, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a3c9b42125104dd40ac80a35a8"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_a6c9c754784fc1567b1e0cbf39"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_34ac15a21679b1714611fbf7d4"`, undefined);
        await queryRunner.query(`DROP TABLE "vercel_deploy"`, undefined);
   }

}
