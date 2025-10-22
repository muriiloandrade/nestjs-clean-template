import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env' });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/infra/database/schema',
  out: './src/infra/database/migrations',
  dbCredentials: {
    database: process.env.PG_DATABASE ?? 'template_db',
    user: process.env.PG_USER ?? 'template_user',
    password: process.env.PG_PASSWORD ?? 'password',
    host: 'localhost',
    port: parseInt(process.env.PG_PORT ?? '5432', 10),
    ssl: false,
  },
  migrations: {
    prefix: 'timestamp',
    schema: 'public',
    table: '__drizzle_migrations__',
  },
});
