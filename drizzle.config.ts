import type { Config } from 'drizzle-kit';
import { comSslVerifyFull } from './src/db/connectionString';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: comSslVerifyFull(process.env.DATABASE_URL_UNPOOLED!),
  },
} satisfies Config;
