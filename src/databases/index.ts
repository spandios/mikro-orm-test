import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/core';
import { NODE_ENV } from '@config';
import { ChatMessage } from '@entities/ChatMessage';
import { ChatRead } from '@entities/ChatRead';
import { ChatRoom } from '@entities/ChatRoom';
import { ChatRoomUser } from '@entities/ChatRoomUser';

export const dbOptions: Options = {
  type: 'postgresql',
  dbName: 'merge_main_db',
  host: 'localhost',
  password: 'dbMerge135!#%',
  user: 'postgres',
  entities: ['./dist/entities'], // path to our JS entities (dist), relative to `baseDir`
  entitiesTs: ['./src/entities'], // path to our TS entities (src), relative to `baseDir`
  debug: NODE_ENV === 'development',
};

export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  chatMessageRepository: EntityRepository<ChatMessage>;
  chatReadRepository: EntityRepository<ChatRead>;
  chatRoomRepository: EntityRepository<ChatRoom>;
  chatRoomUserRepository: EntityRepository<ChatRoomUser>;
};
