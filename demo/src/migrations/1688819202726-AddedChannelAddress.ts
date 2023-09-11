import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedChannelAddress1688819202726 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "channel_address" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "fullName" character varying NOT NULL DEFAULT '', "company" character varying NOT NULL DEFAULT '', "streetLine1" character varying NOT NULL, "streetLine2" character varying NOT NULL DEFAULT '', "city" character varying NOT NULL DEFAULT '', "province" character varying NOT NULL DEFAULT '', "postalCode" character varying NOT NULL DEFAULT '', "country" character varying NOT NULL DEFAULT '', "phoneNumber" character varying NOT NULL DEFAULT '', "distributionCenter" boolean NOT NULL DEFAULT false, "channelId" character varying NOT NULL DEFAULT '', "id" SERIAL NOT NULL, CONSTRAINT "PK_f16ea00b33a3872f3e41bd70df3" PRIMARY KEY ("id"))`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "channel_address"`, undefined);
   }

}
