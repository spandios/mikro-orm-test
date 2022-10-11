import { Options } from '@mikro-orm/core';

export const dbOptions: Options = {
  type: 'postgresql',
  dbName: 'merge_main_db',
  host: 'localhost',
  password: 'dbMerge135!#%',
  user: 'postgres',
};
export default dbOptions;
