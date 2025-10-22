import { users } from './users.schema';

export const dbSchema = {
  users,
};

export type DbSchema = typeof dbSchema;
