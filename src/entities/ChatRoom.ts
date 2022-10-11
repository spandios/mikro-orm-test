import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class ChatRoom {
  @Unique({ name: 'chat_room_room_id_uindex' })
  @PrimaryKey()
  roomId!: string;

  @Property()
  roomType!: string;

  @Property({ nullable: true })
  roomName?: string;

  @Property({ nullable: true })
  owner?: string;

  @Property({ nullable: true })
  mgId?: string;

  @Property({ columnType: 'jsonb', nullable: true, default: '[]' })
  samMgIdList?: any;

  @Property({ nullable: true })
  lastUserId?: string;

  @Property({ nullable: true })
  lastMsgType?: number;

  @Property({ nullable: true })
  lastMsg?: string;

  @Property({ length: 6, nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ length: 6, nullable: true })
  updatedAt?: Date;

  @Property({ length: 6, nullable: true })
  deletedAt?: Date;
}
