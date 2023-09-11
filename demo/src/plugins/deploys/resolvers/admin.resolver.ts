import { Query, Resolver, Args } from "@nestjs/graphql";
import { Ctx, RequestContext } from "@vendure/core";
import { DeployType } from "../entities/deploy.entity";
import { DeploysService } from "../services";

@Resolver()
export class DeploysAdminResolver {
  constructor(private deploysService: DeploysService) { }

  @Query()
  async getActiveDeploy(
    @Args() args: {
        type: DeployType
    },
    @Ctx() ctx: RequestContext) {
    return this.deploysService.getActiveDeploy(ctx, args.type);
  }
}
