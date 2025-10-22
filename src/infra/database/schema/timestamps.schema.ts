import { sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: t.timestamp('created_at').defaultNow().notNull(),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  deletedAt: t
    .timestamp('deleted_at', {
      withTimezone: true,
      mode: 'string',
      precision: 3,
    })
    .default(sql`CURRENT_TIMESTAMP`),
};
