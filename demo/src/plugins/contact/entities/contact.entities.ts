import { Column, Entity } from "typeorm";
import { DeepPartial, VendureEntity } from "@gseller/core";

@Entity()
class Contact extends VendureEntity {

  constructor(input?: DeepPartial<Contact>) {
    super(input);
  }

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  emailAddress: string;

  @Column()
  phoneNumber: string;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  message: string;
}

export { Contact };
