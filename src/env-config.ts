import dotenv from 'dotenv';

export function envConfig() {
  dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
}
