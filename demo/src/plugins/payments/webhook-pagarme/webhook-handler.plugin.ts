import { OrderService, PluginCommonModule, RequestContext, VendurePlugin } from "@vendure/core";

import { ContextStrategy } from "../context-auth-strategy";
import { WebhookPagarmeController } from "./webhook-handler.controller";
import { WorkerPaymentFailedPagarmeService } from "../worker-payment-process/payment-failed-process";
import { WorkerPaymentPagarmeService } from "../worker-payment-process";

@VendurePlugin({
    compatibility: "2.0.5",
    imports: [PluginCommonModule],
    providers: [OrderService, WorkerPaymentPagarmeService, WorkerPaymentFailedPagarmeService, ContextStrategy],
    controllers: [WebhookPagarmeController]
})
export class WebhookPagarmePlugin { }