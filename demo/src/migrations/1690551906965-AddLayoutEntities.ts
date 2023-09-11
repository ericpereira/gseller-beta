import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLayoutEntities1690551906965 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "layout_category" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "UQ_bdba8105db318df3ebd5ec5fab9" UNIQUE ("title"), CONSTRAINT "PK_7b83a67bd7347d00b632333a945" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."layout_type_enum" AS ENUM('WEB', 'MOBILE')`, undefined);
        await queryRunner.query(`CREATE TABLE "layout" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "webAssetId" integer, "mobileAssetId" integer, "isActive" boolean NOT NULL DEFAULT true, "title" character varying NOT NULL, "description" text, "path" text NOT NULL, "type" "public"."layout_type_enum" NOT NULL DEFAULT 'WEB', "price" double precision NOT NULL DEFAULT '0', "id" SERIAL NOT NULL, CONSTRAINT "PK_6e288ce489327c1ec1274d24942" PRIMARY KEY ("id")); COMMENT ON COLUMN "layout"."path" IS 'Layout file url or relative path'; COMMENT ON COLUMN "layout"."type" IS 'Layout type (e.g., ''WEB'', ''MOBILE'')'`, undefined);
        await queryRunner.query(`CREATE TABLE "channel_layout" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "channelId" integer NOT NULL, "layoutId" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "id" SERIAL NOT NULL, CONSTRAINT "PK_68c950926bf5a85b848f0d4d3b9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "layout_categories" ("layoutId" integer NOT NULL, "layoutCategoryId" integer NOT NULL, CONSTRAINT "PK_d29674a98853b6d7140d0e28b01" PRIMARY KEY ("layoutId", "layoutCategoryId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_10e68502091b9b20684a9bce33" ON "layout_categories" ("layoutId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_f79c63423aca3262d6b7cfc86d" ON "layout_categories" ("layoutCategoryId") `, undefined);
        await queryRunner.query(`ALTER TABLE "layout" ADD CONSTRAINT "FK_5f6f047696359c5939718c178a0" FOREIGN KEY ("webAssetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "layout" ADD CONSTRAINT "FK_4d68e2fd4f90fd2a01e47adc2ca" FOREIGN KEY ("mobileAssetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_layout" ADD CONSTRAINT "FK_d19ad28dd49300775b91db157c3" FOREIGN KEY ("layoutId") REFERENCES "layout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_layout" ADD CONSTRAINT "FK_941a3badc86554faa4c2928dbec" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "layout_categories" ADD CONSTRAINT "FK_10e68502091b9b20684a9bce334" FOREIGN KEY ("layoutId") REFERENCES "layout"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "layout_categories" ADD CONSTRAINT "FK_f79c63423aca3262d6b7cfc86df" FOREIGN KEY ("layoutCategoryId") REFERENCES "layout_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "layout_categories" DROP CONSTRAINT "FK_f79c63423aca3262d6b7cfc86df"`, undefined);
        await queryRunner.query(`ALTER TABLE "layout_categories" DROP CONSTRAINT "FK_10e68502091b9b20684a9bce334"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_layout" DROP CONSTRAINT "FK_941a3badc86554faa4c2928dbec"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel_layout" DROP CONSTRAINT "FK_d19ad28dd49300775b91db157c3"`, undefined);
        await queryRunner.query(`ALTER TABLE "layout" DROP CONSTRAINT "FK_4d68e2fd4f90fd2a01e47adc2ca"`, undefined);
        await queryRunner.query(`ALTER TABLE "layout" DROP CONSTRAINT "FK_5f6f047696359c5939718c178a0"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_f79c63423aca3262d6b7cfc86d"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_10e68502091b9b20684a9bce33"`, undefined);
        await queryRunner.query(`DROP TABLE "layout_categories"`, undefined);
        await queryRunner.query(`DROP TABLE "channel_layout"`, undefined);
        await queryRunner.query(`DROP TABLE "layout"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."layout_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "layout_category"`, undefined);
   }

}
