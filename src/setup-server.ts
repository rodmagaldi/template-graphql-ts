import { ApolloServer } from 'apollo-server';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { envConfig } from 'env-config';
import { errorFormatter } from 'error/error';

export async function setup() {
  envConfig();
  await connectToDatabase();
  await runServer();
}

export async function connectToDatabase() {
  try {
    await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/data/db/entity/index.{ts,js}'],
      synchronize: true,
      logging: false,
    });
    console.log('Database connection successful');
  } catch (err) {
    throw err;
  }
}

export async function runServer() {
  const schema = await buildSchema({
    resolvers: [__dirname + '/graphql/**/*.resolver.ts'],
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    formatError: errorFormatter,
    context: ({ req }) => {
      return {
        token: req.headers.authorization,
      };
    },
  });

  await server.listen(process.env.PORT);
  console.log(`Server listening on port ${process.env.PORT}\n`);
}
