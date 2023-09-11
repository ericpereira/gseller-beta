import {
    Args,
    Query,
    Resolver,
    Mutation
  } from '@nestjs/graphql';
  import {
    Allow,
    Ctx,
    ID,
    Permission,
    RequestContext,
    Transaction
  } from '@vendure/core';
import { LayoutService } from '../services/layout.service';
import { LayoutCategoryService } from '../services/layout-category.service';
import { InputCreateLayout } from '../types';
import { ChannelLayoutService } from '../services/channel-layout.service';
import { manageLayoutPermission } from '../permission';

  @Resolver()
  export class LayoutAdminResolver {
    constructor(
      private layoutService: LayoutService,
      private layoutCategoryService: LayoutCategoryService,
      private channelLayoutService: ChannelLayoutService) {
    }

    @Allow(Permission.SuperAdmin)
    @Transaction()
    @Mutation()
    async createLayoutCategory(
      @Args() args: {
        input: { title: string }
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.layoutCategoryService.create(ctx, args.input);
    }

    @Allow(Permission.SuperAdmin)
    @Transaction()
    @Mutation()
    async updateLayoutCategory(
      @Args() args: {
        id: ID,
        input: { title: string }
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.layoutCategoryService.update(ctx, args.id, args.input);
    }

    @Allow(Permission.SuperAdmin)
    @Transaction()
    @Mutation()
    async deleteLayoutCategory(
      @Args() args: {
        id: ID
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.layoutCategoryService.delete(ctx, args.id);
    }

    @Allow(manageLayoutPermission.Read, Permission.SuperAdmin)
    @Query()
    async getAllLayoutCategory(
        @Ctx() ctx: RequestContext
    ): Promise<any> {
      return this.layoutCategoryService.findAll(ctx);
    }

    @Allow(manageLayoutPermission.Read, Permission.SuperAdmin)
    @Query()
    async getLayoutCategory(
        @Args() args: {
          id: ID
        },
        @Ctx() ctx: RequestContext
    ): Promise<any> {
      return this.layoutCategoryService.find(ctx, args.id);
    }

    @Allow(Permission.SuperAdmin)
    @Transaction()
    @Mutation()
    async createLayout(
      @Args() args: {
        input: InputCreateLayout
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.layoutService.create(ctx, args.input);
    }

    @Allow(Permission.SuperAdmin)
    @Transaction()
    @Mutation()
    async updateLayout(
      @Args() args: {
        id: ID,
        input: InputCreateLayout
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.layoutService.update(ctx, args.id, args.input);
    }

    @Allow(Permission.SuperAdmin)
    @Transaction()
    @Mutation()
    async deleteLayout(
      @Args() args: {
        id: ID
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.layoutService.delete(ctx, args.id);
    }

    @Allow(manageLayoutPermission.Read, Permission.SuperAdmin)
    @Query()
    async getAllLayout(
        @Ctx() ctx: RequestContext
    ): Promise<any> {
      return this.layoutService.findAll(ctx);
    }

    @Allow(manageLayoutPermission.Read, Permission.SuperAdmin)
    @Query()
    async getAllActiveLayout(
        @Ctx() ctx: RequestContext
    ): Promise<any> {
      return this.layoutService.findAll(ctx, true);
    }

    @Allow(manageLayoutPermission.Read, Permission.SuperAdmin)
    @Query()
    async getLayout(
      @Args() args: {
        id: ID
      },
      @Ctx() ctx: RequestContext
    ): Promise<any> {
      return this.layoutService.find(ctx, args.id);
    }

    @Allow(manageLayoutPermission.Create, Permission.SuperAdmin)
    @Transaction()
    @Mutation()
    async setChannelLayout(
      @Args() args: {
        input: { layoutId: ID }
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.channelLayoutService.setLayout(ctx, args.input);
    }

    @Allow(manageLayoutPermission.Read, Permission.SuperAdmin)
    @Query()
    async getActiveLayout(
      @Ctx() ctx: RequestContext
    ): Promise<any> {
      return this.channelLayoutService.getActiveLayout(ctx);
    }

    @Allow(Permission.SuperAdmin)
    @Query()
    async getLayoutHistory(
      @Ctx() ctx: RequestContext
    ): Promise<any> {
      return this.channelLayoutService.findAll(ctx);
    }
}