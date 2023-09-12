//import * as CustomPlugins from "../plugins";

import {
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
} from "@vendure/core";

import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import EmailHandlers from "./custom-email-handlers";
import { EmailPlugin } from "@vendure/email-plugin";
import { MultivendorPlugin } from "../plugins/multivendor/multivendor.plugin";
import path from "path";

export const plugins: VendureConfig["plugins"] = [
  AssetServerPlugin.init({
    route: "assets",
    assetUploadDir: path.join(__dirname, "../../static/assets"),
    assetUrlPrefix: "/assets/",
  }),
  DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
  DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
  EmailPlugin.init({
    outputPath: path.join(__dirname, "../../static/email/test-emails"),
    route: "mailbox",
    handlers: EmailHandlers,
    transport: {
      host: process.env.SMTP_HOST,
      type: "smtp",
      port: 465,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    templatePath: path.join(__dirname, "../../static/email/templates"),
    globalTemplateVars: {
      fromAddress: `"${process.env.HANDLEBARS_CLIENT_NAME}" <${process.env.HANDLEBARS_FROM_ADDRESS}>`,
      verifyEmailAddressUrl: "https://vendoor-three.vercel.app/verify",
      passwordResetUrl: process.env.HANDLEBARS_PASSWORD_RESET_URL,
      changeEmailAddressUrl:
        "https://vendoor-three.vercel.app/verify-email-address-change",
      title: process.env.HANDLEBARS_CLIENT_NAME,
    },
  }),
  // AdminUiPlugin.init({
  //   route: "admin",
  //   port: 3000,
  //   adminUiConfig: {
  //     brand: 'GSeller - Admin Panel',
  //     hideVendureBranding: true,
  //     hideVersion: true,
  //   },
  // }),
  // MultivendorPlugin.init({
  //   platformFeePercent: 10,
  //   platformFeeSKU: 'GS',
  // }),
  //...Object.values(CustomPlugins),
];
