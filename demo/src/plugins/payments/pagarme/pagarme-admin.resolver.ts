import {
  CreateRecipientRequest,
  ErrorException,
} from "@gabrielvenegaas/pagarmecoreapilib";
import { Mutation, Resolver, Args, Query } from "@nestjs/graphql";
import { Allow, Ctx, Logger, RequestContext } from "@ericpereiraglobalsys/core";
import { Recipient } from "../payments-permissions";
import { PagarmeService } from "./pagarme.service";

const LOGGER_CONTEXT = "Payments - Pagar.me";

@Resolver()
export class PagarmeAdminResolver {
  constructor(private readonly pagarmeService: PagarmeService) {}

  @Query()
  async getCustomerByDocument(
    @Ctx() ctx: RequestContext,
    @Args() args: { document: string }
  ) {
    try {
      const { document } = args;
      Logger.info(
        `Getting customer by document: ${JSON.stringify(document)}`,
        LOGGER_CONTEXT
      );

      const customer = await this.pagarmeService.getPagarmeCustomer(document);

      Logger.info(
        `Customer found: ${JSON.stringify(customer)}`,
        LOGGER_CONTEXT
      );

      return { __typename: "Customer", ...customer };
    } catch ({ errorResponse }: any) {
      const error = errorResponse as ErrorException;

      Logger.info(
        `Error getting customer: ${JSON.stringify(error)}`,
        LOGGER_CONTEXT
      );

      return {
        __typename: "Error",
        message: error.message,
        errors: error.errors,
      };
    } finally {
      Logger.info("Customer search finished", LOGGER_CONTEXT);
    }
  }


  @Allow(Recipient.Create)
  @Mutation()
  async createRecipient(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateRecipientRequest }
  ) {
    try {
      const { input } = args;
      Logger.info(
        `Creating recipient: ${JSON.stringify(input)}`,
        LOGGER_CONTEXT
      );

      const recipientCreated = await this.pagarmeService.createRecipient(input);

      Logger.info(
        `Recipient created: ${JSON.stringify(recipientCreated)}`,
        LOGGER_CONTEXT
      );

      return { __typename: "Recipient", ...recipientCreated };
    } catch ({ errorResponse }: any) {
      const error = errorResponse as ErrorException;

      Logger.info(
        `Error creating recipient: ${JSON.stringify(error)}`,
        LOGGER_CONTEXT
      );

      return {
        __typename: "Error",
        message: error.message,
        errors: error.errors,
      };
    } finally {
      Logger.info("Recipient creation finished", LOGGER_CONTEXT);
    }
  }
}
