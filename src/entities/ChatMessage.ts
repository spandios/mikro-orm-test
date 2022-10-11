import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class ChatMessage {
  @Unique({ name: 'chat_message_msg_id_uindex' })
  @PrimaryKey()
  msgId!: string;

  @Property()
  roomId!: string;

  @Property({ nullable: true })
  roomType?: string;

  @Property({ nullable: true })
  fromUserId?: string;

  @Property({ nullable: true })
  toUserId?: string;

  @Property({ nullable: true })
  msgType?: string;

  @Property({ nullable: true })
  msg?: string;

  @Property({ columnType: 'jsonb', nullable: true, default: '[]' })
  fileLink?: any;

  @Property({ length: 6, nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ length: 6, nullable: true })
  deletedAt?: Date;
}
