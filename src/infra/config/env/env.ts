import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3033),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('pretty'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PG_HOST: z.enum(['localhost', 'host.docker.internal']).default('localhost'),
  PG_PORT: z.coerce.number().default(5432),
  PG_USER: z.string().default('template_user'),
  PG_PASSWORD: z.string().default('password'),
  PG_DATABASE: z.string().default('template_db'),
});

export type Env = z.infer<typeof envSchema>;
