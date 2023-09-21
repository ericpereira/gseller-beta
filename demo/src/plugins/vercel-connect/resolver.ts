import { Resolver, Mutation } from '@nestjs/graphql';
import {
  Ctx,
  RequestContext,
} from '@gseller/core';
import { VercelConnectService } from './service';
@Resolver()
export class VercelConnectResolver {

  constructor(
    private vercelConnectService: VercelConnectService
  ) { }

  @Mutation()
  async createDeploy(
    @Ctx() ctx: RequestContext,
  ) {
    return
  }

}


