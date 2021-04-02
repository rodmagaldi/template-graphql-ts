import { envConfig } from 'env-config';
import { connectToDatabase } from 'setup-server';
import { mockUsers } from '@test/mock';

async function seedUsers() {
  envConfig();
  await connectToDatabase();
  await mockUsers(2);
}

seedUsers();
