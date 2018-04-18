import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import {Order} from './order'
import {User} from './user'

@Entity({name: 'company'})
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @Column('text', { nullable: false })
  companyName: string;

  @Column('text', { nullable: true })
  companyLogo: string;

  @OneToMany(_ => Order, order => order.company, {eager: true})
  orders: Order[]

  @OneToMany(_ => User, user => user.company, {eager: true})
  users: User[]
}
