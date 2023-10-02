import { EmailEventListener } from "@ericpereiraglobalsys/email-plugin";
import { NewShopEvent } from "../../event-bus/events/new-shop-event";

export const newShopHandler = new EmailEventListener("new-shop")
  .on(NewShopEvent)
  .setRecipient((event) => event.shop.emailAddress)
  .setFrom(`{{ fromAddress }}`)
  .setSubject(`Welcome to Our New Store`)
  .setTemplateVars((event) => ({
    demoSiteUrl: event.shop.demoSiteUrl,
  }));
