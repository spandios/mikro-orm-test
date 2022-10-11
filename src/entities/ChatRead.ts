import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class ChatRead {
  @Unique({ name: 'chat_read_read_id_uindex' })
  @PrimaryKey({ columnType: 'int8' })
  readId!: string;

  @Property({ nullable: true })
  msgId?: string;

  @Property({ nullable: true })
  roomId?: string;

  @Property()
  userId!: string;

  @Property({ length: 6, nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ length: 6, nullable: true })
  deletedAt?: Date;
}
