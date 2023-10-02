import { ContactUsEvent } from "../../event-bus/events/contact-us-event";
import { EmailEventListener } from "@ericpereiraglobalsys/email-plugin";

export const contactHandler = new EmailEventListener("contact")
  .on(ContactUsEvent)
  .setRecipient((event) => event.contact.emailAddress)
  .setFrom(`{{ fromAddress }}`)
  .setSubject(`Contact Us`)
  .setTemplateVars((event) => ({
    message: event.contact.message,
    firstName: event.contact.firstName,
    lastName: event.contact.lastName,
    emailAddress: event.contact.emailAddress,
    phoneNumber: event.contact.phoneNumber,
    country: event.contact.country,
    region: event.contact.region,
  }));
