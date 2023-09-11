import { Channel, VendureEntity } from '@vendure/core';
import { Column, Entity, Index, ManyToOne } from "typeorm";

import { DeepPartial } from "@vendure/common/lib/shared-types";

export enum DeployType {
  Vercel = "vercel",
  Ios = "IOS",
  Android = "Android",
}

export enum DeployStatus {
  created = "created",
  running = "running",
  finished = "finished",
  error = "error",
}

@Entity()
class Deploy extends VendureEntity {

  constructor(input?: DeepPartial<Deploy>) {
    super(input);
  }

  @Column({ type: "enum", enum: DeployType, default: DeployType.Vercel })
  type: DeployType;

  @Column({ default: true })
  active: boolean;

  @Column()
  url: string;

  @Column({ type: "enum", enum: DeployStatus, default: DeployStatus.created })
  status: DeployStatus;

  @Column({ type: 'text' })
  metadata?: string

  @Index()
  @ManyToOne((type) => Channel, { eager: true })
  channel: Channel;
}

export { Deploy };
