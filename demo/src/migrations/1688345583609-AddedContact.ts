import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedContact1688345583609 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "contact" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "emailAddress" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "country" character varying NOT NULL, "region" character varying NOT NULL, "message" character varying NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "contact"`, undefined);
   }

}
