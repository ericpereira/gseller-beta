import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1695319245280 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "authentication_method" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "identifier" character varying, "passwordHash" character varying, "verificationToken" character varying, "passwordResetToken" character varying, "identifierChangeToken" character varying, "pendingIdentifier" character varying, "strategy" character varying, "externalIdentifier" character varying, "metadata" text, "id" SERIAL NOT NULL, "type" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_e204686018c3c60f6164e385081" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_00cbe87bc0d4e36758d61bd31d" ON "authentication_method" ("userId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a23445b2c942d8dfcae15b8de2" ON "authentication_method" ("type") `, undefined);
        await queryRunner.query(`CREATE TABLE "region_translation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "languageCode" character varying NOT NULL, "name" character varying NOT NULL, "id" SERIAL NOT NULL, "baseId" integer, CONSTRAINT "PK_3e0c9619cafbe579eeecfd88abc" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_1afd722b943c81310705fc3e61" ON "region_translation" ("baseId") `, undefined);
        await queryRunner.query(`CREATE TABLE "region" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "type" character varying NOT NULL, "enabled" boolean NOT NULL, "id" SERIAL NOT NULL, "parentId" integer, "discriminator" character varying NOT NULL, CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_ed0c8098ce6809925a437f42ae" ON "region" ("parentId") `, undefined);
        await queryRunner.query(`CREATE TABLE "zone" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_bd3989e5a3c3fb5ed546dfaf832" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "channel" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "token" character varying NOT NULL, "description" character varying DEFAULT '', "defaultLanguageCode" character varying NOT NULL, "availableLanguageCodes" text, "defaultCurrencyCode" character varying NOT NULL, "availableCurrencyCodes" text, "trackInventory" boolean NOT NULL DEFAULT true, "outOfStockThreshold" integer NOT NULL DEFAULT '0', "pricesIncludeTax" boolean NOT NULL, "id" SERIAL NOT NULL, "defaultTaxZoneId" integer, "defaultShippingZoneId" integer, CONSTRAINT "UQ_06127ac6c6d913f4320759971db" UNIQUE ("code"), CONSTRAINT "UQ_842699fce4f3470a7d06d89de88" UNIQUE ("token"), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_afe9f917a1c82b9e9e69f7c612" ON "channel" ("defaultTaxZoneId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_c9ca2f58d4517460435cbd8b4c" ON "channel" ("defaultShippingZoneId") `, undefined);
        await queryRunner.query(`CREATE TABLE "role" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "description" character varying NOT NULL, "permissions" text NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "identifier" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "lastLogin" TIMESTAMP, "id" SERIAL NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "administrator" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "emailAddress" character varying NOT NULL, "id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "UQ_154f5c538b1576ccc277b1ed631" UNIQUE ("emailAddress"), CONSTRAINT "REL_1966e18ce6a39a82b19204704d" UNIQUE ("userId"), CONSTRAINT "PK_ee58e71b3b4008b20ddc7b3092b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "customer_group" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_88e7da3ff7262d9e0a35aa3664e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "customer" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phoneNumber" character varying, "emailAddress" character varying NOT NULL, "id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_3f62b42ed23958b120c235f74d" UNIQUE ("userId"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "address" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fullName" character varying NOT NULL DEFAULT '', "company" character varying NOT NULL DEFAULT '', "streetLine1" character varying NOT NULL, "streetLine2" character varying NOT NULL DEFAULT '', "city" character varying NOT NULL DEFAULT '', "province" character varying NOT NULL DEFAULT '', "postalCode" character varying NOT NULL DEFAULT '', "phoneNumber" character varying NOT NULL DEFAULT '', "defaultShippingAddress" boolean NOT NULL DEFAULT false, "defaultBillingAddress" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "customerId" integer, "countryId" integer, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_dc34d382b493ade1f70e834c4d" ON "address" ("customerId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_d87215343c3a3a67e6a0b7f3ea" ON "address" ("countryId") `, undefined);
        await queryRunner.query(`CREATE TABLE "tag" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "asset" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" character varying NOT NULL, "mimeType" character varying NOT NULL, "width" integer NOT NULL DEFAULT '0', "height" integer NOT NULL DEFAULT '0', "fileSize" integer NOT NULL, "source" character varying NOT NULL, "preview" character varying NOT NULL, "focalPoint" text, "id" SERIAL NOT NULL, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "session" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "expires" TIMESTAMP NOT NULL, "invalidated" boolean NOT NULL, "authenticationStrategy" character varying, "id" SERIAL NOT NULL, "activeOrderId" integer, "activeChannelId" integer, "type" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_232f8e85d7633bd6ddfad42169" ON "session" ("token") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_eb87ef1e234444728138302263" ON "session" ("activeChannelId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_e5598363000cab9d9116bd5835" ON "session" ("type") `, undefined);
        await queryRunner.query(`CREATE TABLE "global_settings" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "availableLanguages" text NOT NULL, "trackInventory" boolean NOT NULL DEFAULT true, "outOfStockThreshold" integer NOT NULL DEFAULT '0', "id" SERIAL NOT NULL, CONSTRAINT "PK_fec5e2c0bf238e30b25d4a82976" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "search_index_item" ("languageCode" character varying NOT NULL, "enabled" boolean NOT NULL, "productName" character varying NOT NULL, "productVariantName" character varying NOT NULL, "description" text NOT NULL, "slug" character varying NOT NULL, "sku" character varying NOT NULL, "facetIds" text NOT NULL, "facetValueIds" text NOT NULL, "collectionIds" text NOT NULL, "collectionSlugs" text NOT NULL, "channelIds" text NOT NULL, "productPreview" character varying NOT NULL, "productPreviewFocalPoint" text, "productVariantPreview" character varying NOT NULL, "productVariantPreviewFocalPoint" text, "inStock" boolean NOT NULL DEFAULT true, "productInStock" boolean NOT NULL DEFAULT true, "productVariantId" integer NOT NULL, "channelId" integer NOT NULL, "productId" integer NOT NULL, "productAssetId" integer, "productVariantAssetId" integer, "price" integer NOT NULL, "priceWithTax" integer NOT NULL, CONSTRAINT "PK_6470dd173311562c89e5f80b30e" PRIMARY KEY ("languageCode", "productVariantId", "channelId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_6fb55742e13e8082954d0436dc" ON "search_index_item" ("productName") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_d8791f444a8bf23fe4c1bc020c" ON "search_index_item" ("productVariantName") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9a5a6a556f75c4ac7bfdd03410" ON "search_index_item" ("description") `, undefined);
        await queryRunner.query(`CREATE TABLE "job_record_buffer" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "bufferId" character varying NOT NULL, "job" text NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_9a1cfa02511065b32053efceeff" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "job_record" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "queueName" character varying NOT NULL, "data" text, "state" character varying NOT NULL, "progress" integer NOT NULL, "result" text, "error" character varying, "startedAt" TIMESTAMP(6), "settledAt" TIMESTAMP(6), "isSettled" boolean NOT NULL, "retries" integer NOT NULL, "attempts" integer NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_88ce3ea0c9dca8b571450b457a7" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "zone_members_region" ("zoneId" integer NOT NULL, "regionId" integer NOT NULL, CONSTRAINT "PK_fc4eaa2236c4d4f61db0ae3826f" PRIMARY KEY ("zoneId", "regionId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_433f45158e4e2b2a2f344714b2" ON "zone_members_region" ("zoneId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_b45b65256486a15a104e17d495" ON "zone_members_region" ("regionId") `, undefined);
        await queryRunner.query(`CREATE TABLE "role_channels_channel" ("roleId" integer NOT NULL, "channelId" integer NOT NULL, CONSTRAINT "PK_6fb9277e9f11bb8a63445c36242" PRIMARY KEY ("roleId", "channelId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_bfd2a03e9988eda6a9d1176011" ON "role_channels_channel" ("roleId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_e09dfee62b158307404202b43a" ON "role_channels_channel" ("channelId") `, undefined);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `, undefined);
        await queryRunner.query(`CREATE TABLE "customer_groups_customer_group" ("customerId" integer NOT NULL, "customerGroupId" integer NOT NULL, CONSTRAINT "PK_0f902789cba691ce7ebbc9fcaa6" PRIMARY KEY ("customerId", "customerGroupId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_b823a3c8bf3b78d3ed68736485" ON "customer_groups_customer_group" ("customerId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_85feea3f0e5e82133605f78db0" ON "customer_groups_customer_group" ("customerGroupId") `, undefined);
        await queryRunner.query(`CREATE TABLE "customer_channels_channel" ("customerId" integer NOT NULL, "channelId" integer NOT NULL, CONSTRAINT "PK_27e2fa538c020889d32a0a784e8" PRIMARY KEY ("customerId", "channelId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a842c9fe8cd4c8ff31402d172d" ON "customer_channels_channel" ("customerId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_dc9f69207a8867f83b0fd257e3" ON "customer_channels_channel" ("channelId") `, undefined);
        await queryRunner.query(`CREATE TABLE "asset_tags_tag" ("assetId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_c4113b84381e953901fa5553654" PRIMARY KEY ("assetId", "tagId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9e412b00d4c6cee1a4b3d92071" ON "asset_tags_tag" ("assetId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_fb5e800171ffbe9823f2cc727f" ON "asset_tags_tag" ("tagId") `, undefined);
        await queryRunner.query(`CREATE TABLE "asset_channels_channel" ("assetId" integer NOT NULL, "channelId" integer NOT NULL, CONSTRAINT "PK_d943908a39e32952e8425d2f1ba" PRIMARY KEY ("assetId", "channelId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_dc4e7435f9f5e9e6436bebd33b" ON "asset_channels_channel" ("assetId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_16ca9151a5153f1169da5b7b7e" ON "asset_channels_channel" ("channelId") `, undefined);
        await queryRunner.query(`ALTER TABLE "authentication_method" ADD CONSTRAINT "FK_00cbe87bc0d4e36758d61bd31d6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "region_translation" ADD CONSTRAINT "FK_1afd722b943c81310705fc3e612" FOREIGN KEY ("baseId") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "region" ADD CONSTRAINT "FK_ed0c8098ce6809925a437f42aec" FOREIGN KEY ("parentId") REFERENCES "region"("id") ON DELETE SET NULL ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_afe9f917a1c82b9e9e69f7c6129" FOREIGN KEY ("defaultTaxZoneId") REFERENCES "zone"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_c9ca2f58d4517460435cbd8b4c9" FOREIGN KEY ("defaultShippingZoneId") REFERENCES "zone"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "administrator" ADD CONSTRAINT "FK_1966e18ce6a39a82b19204704d7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_3f62b42ed23958b120c235f74df" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_dc34d382b493ade1f70e834c4d3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d87215343c3a3a67e6a0b7f3ea9" FOREIGN KEY ("countryId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_eb87ef1e234444728138302263b" FOREIGN KEY ("activeChannelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "zone_members_region" ADD CONSTRAINT "FK_433f45158e4e2b2a2f344714b22" FOREIGN KEY ("zoneId") REFERENCES "zone"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "zone_members_region" ADD CONSTRAINT "FK_b45b65256486a15a104e17d495c" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "role_channels_channel" ADD CONSTRAINT "FK_bfd2a03e9988eda6a9d11760119" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "role_channels_channel" ADD CONSTRAINT "FK_e09dfee62b158307404202b43a5" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_groups_customer_group" ADD CONSTRAINT "FK_b823a3c8bf3b78d3ed68736485c" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_groups_customer_group" ADD CONSTRAINT "FK_85feea3f0e5e82133605f78db02" FOREIGN KEY ("customerGroupId") REFERENCES "customer_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_channels_channel" ADD CONSTRAINT "FK_a842c9fe8cd4c8ff31402d172d7" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_channels_channel" ADD CONSTRAINT "FK_dc9f69207a8867f83b0fd257e30" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "asset_tags_tag" ADD CONSTRAINT "FK_9e412b00d4c6cee1a4b3d920716" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "asset_tags_tag" ADD CONSTRAINT "FK_fb5e800171ffbe9823f2cc727fd" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "asset_channels_channel" ADD CONSTRAINT "FK_dc4e7435f9f5e9e6436bebd33bb" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "asset_channels_channel" ADD CONSTRAINT "FK_16ca9151a5153f1169da5b7b7e3" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "asset_channels_channel" DROP CONSTRAINT "FK_16ca9151a5153f1169da5b7b7e3"`, undefined);
        await queryRunner.query(`ALTER TABLE "asset_channels_channel" DROP CONSTRAINT "FK_dc4e7435f9f5e9e6436bebd33bb"`, undefined);
        await queryRunner.query(`ALTER TABLE "asset_tags_tag" DROP CONSTRAINT "FK_fb5e800171ffbe9823f2cc727fd"`, undefined);
        await queryRunner.query(`ALTER TABLE "asset_tags_tag" DROP CONSTRAINT "FK_9e412b00d4c6cee1a4b3d920716"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_channels_channel" DROP CONSTRAINT "FK_dc9f69207a8867f83b0fd257e30"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_channels_channel" DROP CONSTRAINT "FK_a842c9fe8cd4c8ff31402d172d7"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_groups_customer_group" DROP CONSTRAINT "FK_85feea3f0e5e82133605f78db02"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_groups_customer_group" DROP CONSTRAINT "FK_b823a3c8bf3b78d3ed68736485c"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`, undefined);
        await queryRunner.query(`ALTER TABLE "role_channels_channel" DROP CONSTRAINT "FK_e09dfee62b158307404202b43a5"`, undefined);
        await queryRunner.query(`ALTER TABLE "role_channels_channel" DROP CONSTRAINT "FK_bfd2a03e9988eda6a9d11760119"`, undefined);
        await queryRunner.query(`ALTER TABLE "zone_members_region" DROP CONSTRAINT "FK_b45b65256486a15a104e17d495c"`, undefined);
        await queryRunner.query(`ALTER TABLE "zone_members_region" DROP CONSTRAINT "FK_433f45158e4e2b2a2f344714b22"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_eb87ef1e234444728138302263b"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d87215343c3a3a67e6a0b7f3ea9"`, undefined);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_dc34d382b493ade1f70e834c4d3"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_3f62b42ed23958b120c235f74df"`, undefined);
        await queryRunner.query(`ALTER TABLE "administrator" DROP CONSTRAINT "FK_1966e18ce6a39a82b19204704d7"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_c9ca2f58d4517460435cbd8b4c9"`, undefined);
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_afe9f917a1c82b9e9e69f7c6129"`, undefined);
        await queryRunner.query(`ALTER TABLE "region" DROP CONSTRAINT "FK_ed0c8098ce6809925a437f42aec"`, undefined);
        await queryRunner.query(`ALTER TABLE "region_translation" DROP CONSTRAINT "FK_1afd722b943c81310705fc3e612"`, undefined);
        await queryRunner.query(`ALTER TABLE "authentication_method" DROP CONSTRAINT "FK_00cbe87bc0d4e36758d61bd31d6"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_16ca9151a5153f1169da5b7b7e"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc4e7435f9f5e9e6436bebd33b"`, undefined);
        await queryRunner.query(`DROP TABLE "asset_channels_channel"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb5e800171ffbe9823f2cc727f"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e412b00d4c6cee1a4b3d92071"`, undefined);
        await queryRunner.query(`DROP TABLE "asset_tags_tag"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc9f69207a8867f83b0fd257e3"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_a842c9fe8cd4c8ff31402d172d"`, undefined);
        await queryRunner.query(`DROP TABLE "customer_channels_channel"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_85feea3f0e5e82133605f78db0"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_b823a3c8bf3b78d3ed68736485"`, undefined);
        await queryRunner.query(`DROP TABLE "customer_groups_customer_group"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_4be2f7adf862634f5f803d246b"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f9286e6c25594c6b88c108db7"`, undefined);
        await queryRunner.query(`DROP TABLE "user_roles_role"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_e09dfee62b158307404202b43a"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_bfd2a03e9988eda6a9d1176011"`, undefined);
        await queryRunner.query(`DROP TABLE "role_channels_channel"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_b45b65256486a15a104e17d495"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_433f45158e4e2b2a2f344714b2"`, undefined);
        await queryRunner.query(`DROP TABLE "zone_members_region"`, undefined);
        await queryRunner.query(`DROP TABLE "job_record"`, undefined);
        await queryRunner.query(`DROP TABLE "job_record_buffer"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a5a6a556f75c4ac7bfdd03410"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_d8791f444a8bf23fe4c1bc020c"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_6fb55742e13e8082954d0436dc"`, undefined);
        await queryRunner.query(`DROP TABLE "search_index_item"`, undefined);
        await queryRunner.query(`DROP TABLE "global_settings"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_e5598363000cab9d9116bd5835"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb87ef1e234444728138302263"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_232f8e85d7633bd6ddfad42169"`, undefined);
        await queryRunner.query(`DROP TABLE "session"`, undefined);
        await queryRunner.query(`DROP TABLE "asset"`, undefined);
        await queryRunner.query(`DROP TABLE "tag"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_d87215343c3a3a67e6a0b7f3ea"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc34d382b493ade1f70e834c4d"`, undefined);
        await queryRunner.query(`DROP TABLE "address"`, undefined);
        await queryRunner.query(`DROP TABLE "customer"`, undefined);
        await queryRunner.query(`DROP TABLE "customer_group"`, undefined);
        await queryRunner.query(`DROP TABLE "administrator"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "role"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_c9ca2f58d4517460435cbd8b4c"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_afe9f917a1c82b9e9e69f7c612"`, undefined);
        await queryRunner.query(`DROP TABLE "channel"`, undefined);
        await queryRunner.query(`DROP TABLE "zone"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_ed0c8098ce6809925a437f42ae"`, undefined);
        await queryRunner.query(`DROP TABLE "region"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_1afd722b943c81310705fc3e61"`, undefined);
        await queryRunner.query(`DROP TABLE "region_translation"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_a23445b2c942d8dfcae15b8de2"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_00cbe87bc0d4e36758d61bd31d"`, undefined);
        await queryRunner.query(`DROP TABLE "authentication_method"`, undefined);
   }

}
