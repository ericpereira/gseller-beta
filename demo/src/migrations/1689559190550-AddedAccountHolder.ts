import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedAccountHolder1689559190550 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "account_holder" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "documentNumber" character varying(20) NOT NULL, "legalName" character varying(30), "holderType" character varying(30), "deletedAt" TIMESTAMP, "channelId" character varying NOT NULL DEFAULT '', "id" SERIAL NOT NULL, CONSTRAINT "PK_4ace43524e5340e9f32adb0318c" PRIMARY KEY ("id")); COMMENT ON COLUMN "account_holder"."documentNumber" IS 'CPF or CNPJ of the Account Holder'; COMMENT ON COLUMN "account_holder"."legalName" IS 'Full Name or Legal Entity Name (maximum 30 characters, letters only)'; COMMENT ON COLUMN "account_holder"."holderType" IS 'Account Holder Name (maximum 30 characters, letters only)'; COMMENT ON COLUMN "account_holder"."deletedAt" IS 'The date & time at which the entity was soft-deleted'`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "account_holder"`, undefined);
   }

}
