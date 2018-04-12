import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import {Order} from './order'

export type AddressType =
  | 'visit'
  | 'invoice'
  | 'delivery';

@Entity({name: 'addresses'})
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @Column('text', { nullable: false })
  address: string;

  @Column('text', { nullable: false })
  postcode: string;

  @Column('text', { nullable: false })
  city: string;

  @Column('text', { nullable: false })
  type: AddressType;

  @Column('text', { nullable: true })
  telephoneNumber: string;

  @Column('text', { nullable: true })
  contactPerson: string;

  @ManyToOne(_ => Order, order => order.addresses)
  order: Order

  @RelationId((address: Address)=> address.order)
  orderId: number
}
