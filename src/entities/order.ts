import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, RelationId, OneToMany,
  OneToOne, JoinColumn } from 'typeorm'
import {IsInt, IsString, Min, MinLength, IsDate} from 'class-validator'
import {Delivery} from './delivery'
import {User} from './user'
import {Address} from './address'
import {Channel} from './channel'

@Entity()
export class Order extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  shortDescription: string

  @IsString()
  @Column('text', {nullable: true})
  description: string

  @IsInt()
  @Min(1)
  @Column('integer', {default:1})
  amount: number

  @IsDate()
  @Column('date')
  orderDate: Date

  @IsDate()
  @Column('date', {nullable:true})
  deliveryDate: Date

  @IsString()
  @MinLength(1)
  @Column('text', {nullable:true})
  paymentType: string

  @ManyToOne(_ => Delivery, delivery => delivery.orders)
  delivery: Delivery

  @RelationId((order: Order)=> order.delivery)
  deliveryId: number

  @ManyToOne(_ => User, user => user.orders)
  user: User

  @RelationId((order: Order)=> order.user)
  userId: number

  @OneToMany(_ => Address, addresses => addresses.order, {eager: true})
  addresses: Address[]

  @OneToOne(_=> Channel, channel => channel.order, {eager: true})
  @JoinColumn()
  channel: Channel
}
