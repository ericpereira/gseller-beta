import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveUnusedFieldsVercel1690900486159 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "deploy" DROP CONSTRAINT "FK_4c36370d1fdab3b5d72257af67c"`, undefined);
        await queryRunner.query(`ALTER TABLE "deploy" DROP COLUMN "vercelDeployId"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "deploy" ADD "vercelDeployId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "deploy" ADD CONSTRAINT "FK_4c36370d1fdab3b5d72257af67c" FOREIGN KEY ("vercelDeployId") REFERENCES "vercel_deploy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

}
