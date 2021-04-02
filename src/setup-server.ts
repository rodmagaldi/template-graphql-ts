import { ApolloServer } from 'apollo-server';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { envConfig } from 'env-config';
import { errorFormatter } from 'error/error';
import { context } from '@server/context';

export async function setup() {
  envConfig();
  await connectToDatabase();
  await runServer();
}

export async function connectToDatabase() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/data/db/entity/index.{ts,js}'],
      synchronize: true,
      logging: false,
    });
    connection.runMigrations();
    console.log('Database connection successful');
  } catch (err) {
    throw err;
  }
}

export async function runServer() {
  const schema = await buildSchema({
    resolvers: [__dirname + '/graphql/module/**/*.resolver.ts'],
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    formatError: errorFormatter,
    context,
  });

  await server.listen(process.env.PORT);
  console.log(`Server listening on port ${process.env.PORT}\n`);
}
