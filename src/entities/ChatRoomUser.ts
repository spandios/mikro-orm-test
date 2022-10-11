import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class ChatRoomUser {
  @Unique({ name: 'chat_room_user_room_user_info_id_uindex' })
  @PrimaryKey()
  roomUserInfoId!: string;

  @Property({ nullable: true })
  roomId?: string;

  @Property({ nullable: true })
  userId?: string;

  @Property({ nullable: true })
  joinType?: string;

  @Property({ length: 6, nullable: true, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt?: Date;

  @Property({ length: 6, nullable: true })
  deletedAt?: Date;
}
