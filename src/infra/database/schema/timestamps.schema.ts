import { sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: t
    .timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deletedAt: t.timestamp('deleted_at', {
    withTimezone: true,
    mode: 'string',
  }),
};
