import { ApolloServer } from 'apollo-server';
// import { User } from 'entity/user';
// import { resolvers } from 'graphql/resolvers';
// import { typeDefs } from 'graphql/typeDefs';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { envConfig } from 'env-config';
import { formatError } from 'error/error';

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
      entities: [],
      synchronize: false,
      logging: false,
    });
    console.log('Database connection successful\n');
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
    formatError: formatError,
    context: ({ req }) => {
      return {
        token: req.headers.authorization,
      };
    },
  });

  await server.listen(process.env.PORT);
  console.log(`Server listening on port ${process.env.PORT}\n`);
}
