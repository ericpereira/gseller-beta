import {
  Channel,
  ChannelService,
  LanguageCode,
  Logger,
  OrderService,
  PaymentMethod,
  PaymentMethodService,
  PluginCommonModule,
  RequestContextService,
  TransactionalConnection,
  VendurePlugin,
  defaultOrderProcess
} from "@vendure/core";

import { CONNECTED_PAYMENT_METHOD_CODE } from './constants';
import { ContextStrategy } from "../context-auth-strategy";
import { OnApplicationBootstrap } from '@nestjs/common';
import { OrderCustomFields } from "./order-custom-fields";
import { PagarmeAdminResolver } from "./pagarme-admin.resolver";
import { PagarmePostbackController } from "./pagarme-postback.controller";
import { PagarmeService } from "./pagarme.service";
import TokenActiveOrderStrategy from "./token-active-order-strategy";
import { WorkerPaymentFailedPagarmeService } from "../worker-payment-process/payment-failed-process";
import { WorkerPaymentPagarmeService } from "../worker-payment-process";
import { customOrderProcess } from "./custom-order-states";
import { gql } from "graphql-tag";
import { pagarmeHandler } from "./pagarme.handler";

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [
    PagarmeService,
    // RecipientContractService,
    // InstallmentsService,
    OrderService,
    WorkerPaymentPagarmeService,
    WorkerPaymentFailedPagarmeService,
    ContextStrategy],
  controllers: [PagarmePostbackController],
  // entities: [Installments],
  configuration: (config) => {
    config.paymentOptions.paymentMethodHandlers.push(pagarmeHandler);

    // custom fields
    config.customFields.Order.push(...OrderCustomFields!);

    //permitir alterar pedidos que deram falha no pagamento
    config.orderOptions.activeOrderStrategy = new TokenActiveOrderStrategy()

    //cria um novo estado de ordem intermediário para poder adicionar um novo pagamento caso necessário

    //TO DO: verificar se isso aqui é necessário na cesconetto
    // const customDefaultOrderProcess = configureDefaultOrderProcess({
    //   checkFulfillmentStates: false,
    // });

    config.orderOptions.process = [defaultOrderProcess, customOrderProcess];

    return config;
  },
  adminApiExtensions: {
    schema: gql`
      extend type Query {
        getCustomerByDocument(document: String!): Customer
      }

      extend type Mutation {
        createRecipient(input: CreateRecipientInput!): CreateRecipientResponse
      }
    `,
    resolvers: [PagarmeAdminResolver],
  },
})
export class PagarmePlugin implements OnApplicationBootstrap {

  constructor(
    private connection: TransactionalConnection,
    private channelService: ChannelService,
    private requestContextService: RequestContextService,
    private paymentMethodService: PaymentMethodService,
  ) { }

  async onApplicationBootstrap() {
    await this.ensureConnectedPaymentMethodExists();
  }

  private async ensureConnectedPaymentMethodExists() {
    const paymentMethod = await this.connection.rawConnection.getRepository(PaymentMethod).findOne({
      where: {
        code: CONNECTED_PAYMENT_METHOD_CODE,
      },
    });
    if (!paymentMethod) {

      Logger.info(
        `Pagarme`,
        `Connected Payments (${pagarmeHandler.code})`
      );
      const ctx = await this.requestContextService.create({ apiType: 'admin' });
      const allChannels = await this.connection.getRepository(ctx, Channel).find();

      const createdPaymentMethod = await this.paymentMethodService.create(ctx, {
        code: CONNECTED_PAYMENT_METHOD_CODE,
        enabled: true,
        handler: {
          code: pagarmeHandler.code,
          arguments: [{
            name: 'apiKey',
            value: process.env.PAGARME_SECRET_KEY,
          }],
        },
        translations: [
          {
            languageCode: LanguageCode.en,
            name: 'GSeller: Connected Payments (Pagarme)',
          },
          {
            languageCode: LanguageCode.pt_BR,
            name: 'GSeller: Pagamentos Conectados (Pagarme)',
          },
        ],
      });
      await this.channelService.assignToChannels(
        ctx,
        PaymentMethod,
        createdPaymentMethod.id,
        allChannels.map(c => c.id),
      );
    }
  }
}

