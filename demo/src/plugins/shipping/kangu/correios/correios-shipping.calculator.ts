import {
  LanguageCode,
  ShippingCalculator,
  TransactionalConnection,
} from "@gseller/core";

import axios, { AxiosResponse } from "axios";
import { ChannelAddress } from "../../../../plugins/store-config/channel-address/entities/channel-address.entity";

interface KanguDataResponse {
  vlrFrete: number;
  prazoEnt: number;
  dtPrevEnt: string;
  tarifas: {};
  error: {
    codigo: string;
    mensagem: string;
  };
  idSimulacao: number;
  idTransp: number;
  cnpjTransp: string;
  idTranspResp: number;
  cnpjTranspResp: string;
  alertas: null;
  nf_obrig: string;
  url_logo: string;
  transp_nome: string;
  descricao: string;
  servico: string;
  referencia: string;
}

export const api = axios.create({
  baseURL: process.env.KANGU_ENDPOINT,
});

let connection: TransactionalConnection;
// let productsCubicInformationService: ProductsCubicInformationService;

export const flatRateCalculator = new ShippingCalculator({
  code: "correios-rate-calculator",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Correios Shipping Calculator",
    },
  ],
  init: (injector) => {
    connection = injector.get(TransactionalConnection);
  },
  args: {},
  calculate: async (ctx, order, args) => {
    const cepOrigem = await connection.rawConnection
      .getRepository(ChannelAddress)
      .findOne({
        where: {
          distributionCenter: true,
          channel: {
            id: ctx.channel.id,
          },
        },
      });

    const products = order.lines.map((line) => {
      return {
        // @ts-ignore
        peso: line.productVariant.customFields.weight,
        // @ts-ignore
        altura: line.productVariant.customFields.height,
        // @ts-ignore
        largura: line.productVariant.customFields.width,
        // @ts-ignore
        comprimento: line.productVariant.customFields.lenght,
        tipo: "C",
        valor: line.productVariant.price / 100,
        produto: line.productVariant.name,
      };
    });

    const payload = {
      cepOrigem: cepOrigem!.postalCode,
      cepDestino: order.shippingAddress.postalCode,
      origem: ctx.channel.code,
      produtos: products,
      ordernar: "preco",
      servicos: ["E"],
    };

    try {
      const { data }: AxiosResponse<KanguDataResponse[]> = await api.get(
        "/simular",
        {
          data: JSON.stringify(payload),
          headers: {
            token: process.env.KANGU_TOKEN,
          },
        }
      );

      const deliveryDate = new Date(data[0].dtPrevEnt).toLocaleDateString(
        "pt-BR"
      );

      const price = Number(data[0].vlrFrete.toFixed(2)) * 100;

      return {
        metadata: {
          success: true,
          deliveryDate: deliveryDate,
        },
        price,
        taxRate: 0,
        priceIncludesTax: false,
      };
    } catch (error) {
      console.log(error);

      return {
        metadata: {
          success: false,
        },
        price: 0,
        taxRate: 0,
        priceIncludesTax: false,
      };
    }
  },
});
