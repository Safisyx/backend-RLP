import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";

export type AddressType =
  | "visit address"
  | "invoice address"
  | " delivery address";

@Entity({name: "addresses"})
export default class Address extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @Column("text", { nullable: false })
  address: string;

  @Column("text", { nullable: false })
  postcode: string;

  @Column("text", { nullable: false })
  city: string;

  @Column("text", { nullable: false })
  type: AddressType;
}
