import { ProductVariantService, RequestContext } from "@vendure/core";

import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductsCubicInformationService {
  constructor(private productVariantService: ProductVariantService) { }

  async getCubicMeters(ctx: RequestContext, id: string) {
    const productVariant = await this.productVariantService.findOne(ctx, id);

    if (!productVariant)
      return {
        success: false,
        message: "Não foi encontrado o Product Variant",
        cubicMeters: 0,
      };

    const {
      customFields: { height, length, width }
    }: any = productVariant;

    const cubicMeters = Number(height) * Number(length) * Number(width);

    return {
      success: true,
      message: "Sucesso",
      cubicMeters,
    };
  }
}
