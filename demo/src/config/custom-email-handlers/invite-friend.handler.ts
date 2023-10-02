import { EmailEventListener } from "@ericpereiraglobalsys/email-plugin";
import { InviteFriendEvent } from "../../event-bus/events/invite-friend-event";

export const inviteFriendtHandler = new EmailEventListener('invite-friend')
    .on(InviteFriendEvent)
    .setFrom('{{ fromAddress }}')
    .setRecipient(event => event.invite.emailAddress)
    .setSubject(`Invite for Farmly`)
    .setTemplateVars(event => ({
        inviter: event.invite.guest,
        url: event.invite.url
    }))