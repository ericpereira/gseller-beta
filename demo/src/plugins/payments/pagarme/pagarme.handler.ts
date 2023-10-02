import { ChargesController, OrdersController } from "@gabrielvenegaas/pagarmecoreapilib";
import { LanguageCode, Logger, OrderService, PaymentMethodHandler, PaymentService, TransactionalConnection } from "@ericpereiraglobalsys/core";

import { CustomOrderFields } from "./@types/custom-fields";
import { PagarmeService } from "./pagarme.service";
import { ChannelBankAccount } from "../../../plugins/store-config/channel-finances/entities/bank-account.entity";

enum PaymentMethods {
  PIX = "pix",
  CREDIT_CARD = "credit_card",
  BOLETO = "boleto"
}

let pagarmeService: PagarmeService;
let orderService: OrderService;
let paymentService: PaymentService;
let connection: TransactionalConnection;

export const pagarmeHandler = new PaymentMethodHandler({
  code: "pagarme",
  description: [
    { languageCode: LanguageCode.en, value: "Pagar.me" },
    { languageCode: LanguageCode.pt_BR, value: "Pagar.me" },
  ],
  args: {
    apiKey: {
      type: "string",
    },
  },
  init: (config) => {
    Logger.info(
      "Initializing Pagar.me payment handler",
      "PagarmePaymentHandler"
    );
    pagarmeService = config.get(PagarmeService);
    orderService = config.get(OrderService);
    paymentService = config.get(PaymentService)
    connection = config.get(TransactionalConnection)
  },
  createPayment: async (ctx, order, amount, args, metadata) => {
    // fazer uma consulta no nosso banco para buscar o id do recipiente

    // ir na pagarme para pelo ID buscado e checar o status do recipiente
    // fazer as seguintes validações:

    // 1. Se o status do recipiente for "ativo"
    // 2. Se o status da conta bancária for "ativa"

    // fazer consulta à tabela de configuração do contrato para saber qual a taxa cobrada do usuário
    // get recipient
    // const { recipient, recipientContract } = await pagarmeService.getRecipient(
    //   ctx.channel.token,
    //   ctx
    // );

    // console.log('>createPayment', recipient)

    const getCountryCode = (code: string) => {
      return code === 'pt_BR' ? 'BR' : code
    }

    const { channel } = ctx
    if (!channel) {
      throw Error('Channel not found')
    }

    const channelBankAccount = await connection
      .rawConnection
      .getRepository(ChannelBankAccount)
      .createQueryBuilder('bankAccount')
      .leftJoinAndSelect('bankAccount.accountHolder', 'accountHolder')
      .where('bankAccount.channelId = :channelId', { channelId: channel.id as string })
      .andWhere('bankAccount.deletedAt IS NULL')
      .getOne() as ChannelBankAccount;

    if(!channelBankAccount) throw Error('Channel bank account not found')
    

    // check channelBankAccount status
    if (channelBankAccount.inAnalysis) {
      throw new Error("Recipient is not active");
    }

    // if (recipient.defaultBankAccount.status !== "active") {
    //   throw new Error("Recipient bank account is not active");
    // }

    // if (!recipientContract.isActive) {
    //   throw new Error("Recipient contract is not active");
    // }

    if (!metadata.customer?.document_type) {
      throw new Error("Customer document type invalid, possible values: PASSPORT, CPF or CNPJ")
    }

    if (!metadata.customer?.document) {
      throw new Error("Customer document invalid, possible values: CPF, CNPJ or PASSAPORT number")
    }

    if (!metadata.customer?.type) {
      throw new Error("Customer type invalid, possible values: individual or company")
    }

    let paymentObj = {}
    switch (metadata.payment_method) {
      case PaymentMethods.PIX:
        paymentObj = {
          pix: {
            expires_in: 86400,  //em quanto tempo expira o pix
            additional_information: [
              {
                name: 'Pagamento',
                value: 'Pedido'
              }
            ]
          },
        }
        break;
      case PaymentMethods.CREDIT_CARD:
        paymentObj = {
          credit_card: {
            operation_type: "auth_and_capture", //auth_and_capture (order.status = paid or failed), auth_only (order.status = pending), ou pre_auth (order.status = pending).
            installments: metadata?.credit_card?.installments,
            statement_descriptor: "Vendoor",
            recurrence: false,
            card: {
              ...metadata?.credit_card?.card,
              billing_address: {
                line_1: order.billingAddress.streetLine1 ? order.billingAddress.streetLine1 : order.shippingAddress.streetLine1,
                zip_code: order.billingAddress.postalCode ? order.billingAddress.postalCode : order.shippingAddress.postalCode,
                city: order.billingAddress.city ? order.billingAddress.city : order.shippingAddress.city,
                state: order.billingAddress.province ? order.billingAddress.province : order.shippingAddress.province,
                country: order.billingAddress.countryCode ? getCountryCode(order.billingAddress.countryCode) : getCountryCode(order.shippingAddress.countryCode),
              },
            },
          }
        }
        break;
      case PaymentMethods.BOLETO:
        paymentObj = {
          boleto: {
            bank: '001', //TO DO: ver qual banco vai usar para gerar o boleto
            instructions: 'Pagar até o vencimento',
            nosso_numero: order.id, //TO DO: ver como gerar esse número
            type: 'DM', // DM (Duplicata Mercantil) e BDP (Boleto de proposta)
            document_number: order.id
          }
        }
        break;
      default:
        throw new Error("Payment method not found");
    }

    const split = {
      split: [
        {
          amount: 50, //Get from taxa zona 
          recipient_id: process.env.PAGARME_DEFAULT_RECIPIENT_ID,
          type: "percentage",
          options: {
            charge_processing_fee: false,
            charge_remainder_fee: false,
            liable: false,
          },
        },
        {
          amount: 50, //Get from database ChannelBankAccount
          recipient_id: channelBankAccount.recipientId,
          type: "percentage",
          options: {
            charge_processing_fee: true,
            charge_remainder_fee: true,
            liable: true,
          },
        },
      ],
    }

    const composedOrder = {
      closed: false, //para deixar a ordem aberta e poder adicionar outras formas de pagamento posteriormente quando der erro
      code: order.code,
      items: order.lines.map((line) => ({
        amount: line.unitPriceWithTax,
        quantity: line.quantity,
        code: line.productVariant.id,
        description: line.productVariant.name,
      })),
      customer: {
        name: `${order.customer?.firstName} ${order.customer?.lastName}`,
        email: order.customer?.emailAddress,
        code: order.customer?.id,
        document: metadata.customer?.document, //CPF, CNPJ, PASSAPORTE do cliente.
        document_type: metadata.customer?.document_type, //Tipo de documento. Valores possíveis: PASSPORT , CPF, CNPJ.
        type: metadata.customer?.type, //Tipo de cliente. Valores possíveis: individual e company.
        phones: {
          mobile_phone: {
            country_code: "55",
            number: order.customer?.phoneNumber.slice(2),
            area_code: order.customer?.phoneNumber.slice(0, 2),
          },
        },
        address: {
          country: getCountryCode(order.shippingAddress.countryCode),
          state: order.shippingAddress.province,
          city: order.shippingAddress.city,
          zip_code: order.shippingAddress.postalCode,
          //zip_code: '01046010', //test
          line_1: order.shippingAddress.streetLine1,
          line_2: order.shippingAddress.streetLine2,
        },
      },
      shipping: {
        amount: order.shippingWithTax, //TO DO: Verificar se esse valor de frete está correto
        description: "Frete",
        recipient_name: `${order.customer?.firstName} ${order.customer?.lastName}`,
        recipient_phone: order.customer?.phoneNumber,
        address: {
          country: getCountryCode(order.shippingAddress.countryCode),
          state: order.shippingAddress.province,
          city: order.shippingAddress.city,
          zip_code: order.shippingAddress.postalCode,
          line_1: order.shippingAddress.streetLine1,
          line_2: order.shippingAddress.streetLine2,
        },
      },
      payments: [
        {
          amount: amount ? amount : order.totalWithTax,
          payment_method: metadata?.payment_method,
          ...paymentObj,
          ...split
        },
      ],
    };
    const activeOrder = order;
    const currentAmount = amount ? amount : activeOrder.totalWithTax;
    const customFields: any = activeOrder.customFields

    try {
      //verifica se a ordem ja existe na pagarme, caso não exista, cria uma nova
      const order = customFields.pagarmeOrderId ?
        await OrdersController.getOrder(customFields.pagarmeOrderId, (response: any) => { }) :
        await OrdersController.createOrder(composedOrder)
      //caso a ordem ja exista na pagarme, cria um novo pagamento pra ela
      const newCharge = customFields.pagarmeOrderId ? {
        order_id: order.id,
        amount: currentAmount,
        payment: {
          payment_method: metadata?.payment_method,
          ...paymentObj,
          ...split
        },
      } : {}

      //caso crie um novo pagamento, pega esse pagamento, caso contrário ele será o primeiro pagamento da nova ordem criada
      const charge = customFields?.pagarmeOrderId ? await ChargesController.createCharge(newCharge, 'pagarme', (response: any) => { })
        : order.charges[0]

      let updateOrderObj: any = {
        pagarmeOrderId: order.id,
        pagarmePaymentType: metadata.payment_method,
        pagarmeMetadata: JSON.stringify(charge)
      }

      if (PaymentMethods.BOLETO === metadata.payment_method) {
        updateOrderObj = {
          ...updateOrderObj,
          pagarmeBoletoUrl: charge.lastTransaction.url
        }
      }

      if (PaymentMethods.PIX === metadata.payment_method) {
        updateOrderObj = {
          ...updateOrderObj,
          pagarmeQrcode: charge.lastTransaction.qrCodeUrl
        }
      }

      //adiciona informações da ordem criada na pagarme na ordem do nosso banco para verificar posteriormente no frontend
      const updatedOrder = await orderService.updateCustomFields(ctx, activeOrder.id, {
        ...updateOrderObj
      })

      return {
        amount: currentAmount,
        state: order.status === 'paid' ? 'Settled' : (order.status === 'pending' ? 'Authorized' : 'Declined'),
        transactionId: charge.id,
        metadata: {
          ...order,
        },
      }
    } catch (err: any) {
      console.log(err)
      console.log(err.errorResponse.errors)
      return {
        amount: currentAmount,
        state: "Error",
        transactionId: undefined,
        errorMessage: "Erro ao criar pedido",
        metadata: err as any,
      };
    }
  },
  async settlePayment(ctx, _, payment, { apiKey }) {
    try {
      return { success: true };
    } catch (e: any) {
      Logger.error(e.message, "PagarmePaymentHandler");
      return {
        success: false,
        errorMessage: e.message,
      };
    }
  },
  cancelPayment: async (ctx, order, payment, args) => {
    if (payment.state === 'Authorized' && payment.transactionId) {
      return {
        success: true
      }
    }
    throw new Error(`Payment ${payment.transactionId} not elegible to be canceled.`);
  },
  createRefund: async (ctx, refundOrderInput, amount, args) => {
    try {

      const payment = await paymentService.findOneOrThrow(ctx, refundOrderInput.paymentId)

      //caso seja um payment valido na pagame
      if (payment.transactionId) {
        const cancelCharge = await ChargesController.cancelCharge(payment.transactionId, undefined, '', undefined)

        if (cancelCharge && cancelCharge.status === 'canceled') {
          //muda o status da order
          await orderService.transitionToState(ctx, payment.order.id, 'PaymentRefunded')

          return {
            transactionId: cancelCharge.id as string,
            state: "Settled",
            metadata: { ...cancelCharge }
          }
        }
      }
      return {
        transactionId: payment.transactionId as string,
        state: "Failed",
        metadata: { ...payment.metadata }
      }
    } catch (error) {
      Logger.error(error as string)
      throw new Error("Erro when try to refund error, try again later");
    }

  },
});
