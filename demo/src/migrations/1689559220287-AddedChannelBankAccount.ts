import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedChannelBankAccount1689559220287 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "channel_bank_account" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "bankCode" character varying(3) NOT NULL, "branchNumber" character varying(4) NOT NULL, "branchCheckDigit" character varying(1) NOT NULL, "accountNumber" character varying(13) NOT NULL, "accountCheckDigit" character varying(2) NOT NULL, "type" character varying NOT NULL DEFAULT 'conta_corrente', "inAnalysis" boolean NOT NULL DEFAULT false, "recipientId" character varying, "installmentAmount" integer NOT NULL DEFAULT '0', "deletedAt" TIMESTAMP, "channelId" character varying NOT NULL DEFAULT '', "id" SERIAL NOT NULL, "accountHolderId" integer, CONSTRAINT "REL_952a4d405b7bc3f018d34e3cc2" UNIQUE ("accountHolderId"), CONSTRAINT "PK_67aa0b281c1ec1d4f685a31703e" PRIMARY KEY ("id")); COMMENT ON COLUMN "channel_bank_account"."bankCode" IS 'Bank code must have a maximum 3 digits'; COMMENT ON COLUMN "channel_bank_account"."branchNumber" IS 'Branch number must have a maximum of 4 characters'; COMMENT ON COLUMN "channel_bank_account"."branchCheckDigit" IS 'Branch check digit must have a maximum of 1 numeric character'; COMMENT ON COLUMN "channel_bank_account"."accountNumber" IS 'Account number must have a maximum of 13 numeric characters'; COMMENT ON COLUMN "channel_bank_account"."accountCheckDigit" IS 'Account check digit must have a maximum of 2 numeric characters'; COMMENT ON COLUMN "channel_bank_account"."type" IS 'Account Type: conta_corrente, conta_poupanca, conta_corrente_conjunta, conta_poupanca_conjunta'; COMMENT ON COLUMN "channel_bank_account"."inAnalysis" IS 'Indicates whether the account is in analysis'; COMMENT ON COLUMN "channel_bank_account"."recipientId" IS 'Indicates whether the account is the default account for the recipient'; COMMENT ON COLUMN "channel_bank_account"."installmentAmount" IS 'Indicates whether the account is the default account for the recipient'; COMMENT ON COLUMN "channel_bank_account"."deletedAt" IS 'The date & time at which the entity was soft-deleted'`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_bank_account" ADD CONSTRAINT "FK_952a4d405b7bc3f018d34e3cc26" FOREIGN KEY ("accountHolderId") REFERENCES "account_holder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "channel_bank_account" DROP CONSTRAINT "FK_952a4d405b7bc3f018d34e3cc26"`, undefined);
        await queryRunner.query(`DROP TABLE "channel_bank_account"`, undefined);
   }

}
