import { Options } from '@mikro-orm/core';
import { BaseEntity } from './src/entities/base.entity';
import { ChatMessage } from './src/entities/chat-message.entity';
import { NODE_ENV } from './src/config';

export const dbOptions: Options = {
  type: 'postgresql',
  dbName: 'merge_main_db',
  host: 'localhost',
  password: 'dbMerge135!#%',
  user: 'postgres',
  entities: [BaseEntity, ChatMessage],
  debug: NODE_ENV === 'development',
};
export default dbOptions;
