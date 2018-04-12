import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToMany } from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { Exclude } from 'class-transformer';
import { MinLength, IsString, IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import {Order} from './order'
import {Message} from './message'
import {Channel} from './channel'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @Column('text', { nullable: false })
  companyName: string;

  @IsString()
  @MinLength(2)
  @Column('text')
  firstName: string;

  @IsString()
  @MinLength(2)
  @Column('text')
  lastName: string;

  @IsEmail()
  @Column('text')
  email: string;

  @IsString()
  @MinLength(8)
  @Column('text', {nullable: true})
  @Exclude({ toPlainOnly: true })
  password: string;

  @IsString()
  @Column('text', {default: 'External'})
  role: string

  @IsString()
  @Column('text', { nullable: true })
  telephoneNumber: string;

  @OneToMany(_ => Order, order => order.user, {eager: true})
  orders: Order[];

  @OneToOne(_=> Message, message => message.user)
  message: Message

  @ManyToMany(_=> Channel, channel => channel.users)
  channels: Channel[]

  async setPassword(rawPassword: string) {
    const hash = await bcrypt.hash(rawPassword, 10);
    this.password = hash;
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password);
  }
}
