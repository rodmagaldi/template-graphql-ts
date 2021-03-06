import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { envConfig } from 'env-config';
import { errorFormatter } from 'error/error';
import { context } from '@server/context';
import routes from './api/rest/index.routes';

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
    // Run migrations so test database is properly setup to Github's testing workflow
    if (process.env.NODE_ENV === 'test') {
      await connection.runMigrations();
    }
    console.log('Database connection successful');
  } catch (err) {
    throw err;
  }
}

export async function runServer() {
  const schema = await buildSchema({
    resolvers: [__dirname + '/api/graphql/module/**/*.resolver.ts'],
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    formatError: errorFormatter,
    context,
  });

  const app = express();

  app.use(express.json());
  app.use(routes);

  server.applyMiddleware({ app });

  await app.listen(process.env.PORT);
  console.log(`Server listening on port ${process.env.PORT}\n`);
}
