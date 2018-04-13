import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, RelationId, JoinColumn, ManyToOne} from 'typeorm'
import {IsString, MinLength} from 'class-validator'
import {User} from './user'
import {Channel} from './channel'

@Entity()
export class Message extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(1)
  @Column('text')
  content: string

  @IsString()
  @Column('text')
  condition: string

  @ManyToOne(_ => User, user => user.messages)
  @JoinColumn()
  user: User

  @RelationId((message: Message)=> message.user)
  userId: number

  @ManyToOne(_=>Channel, channel=>channel.messages)
  channel: Channel

  @RelationId((message: Message)=> message.channel)
  channelId: number

}
