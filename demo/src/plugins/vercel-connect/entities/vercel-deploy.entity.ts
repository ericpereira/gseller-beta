import { Channel, VendureEntity } from '@gseller/core';
import { Column, Entity, Index, ManyToMany } from "typeorm";

import { DeepPartial } from "@gseller/common/lib/shared-types";

@Entity()
class VercelDeploy extends VendureEntity {

  constructor(input?: DeepPartial<VercelDeploy>) {
    super(input);
  }

  @Column({ default: undefined, nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  deployId: string;

  @Column({ type: 'json', nullable: true })
  payloadAlias?: any;

  @Column({ type: 'boolean', nullable: false })
  aliasAssigned: boolean;

  @Column({ nullable: true })
  aliasError?: string;

  @Index()
  @Column({ nullable: true })
  creatorUid?: string;

  @Index()
  @Column({ nullable: true })
  creatorUsername?: string;

  @Index()
  @Column({ nullable: true })
  creatorEmail: string;

  @Column({ nullable: true })
  vercelId?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'json', nullable: true })
  meta?: any;

  @Column({ nullable: true })
  public?: boolean;

  @Column({ nullable: true })
  readyState?: string;

  @Column({ type: 'json', nullable: true })
  regions?: string[];

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  teamId?: string;

  @Column({ nullable: true })
  teamName?: string;

  @Column({ nullable: true })
  teamSlug?: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  version?: number;

  @Column({ type: 'json', nullable: true })
  builds?: any[];

  @Column({ nullable: true })
  ownerId?: string;

  @Column({ nullable: true })
  plan?: string;

  @Column({ nullable: true })
  target?: string;

  @Column({ nullable: true })
  inspectorUrl?: string;
}

export { VercelDeploy };
