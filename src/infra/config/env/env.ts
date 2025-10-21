import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3033),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('pretty'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type Env = z.infer<typeof envSchema>;
