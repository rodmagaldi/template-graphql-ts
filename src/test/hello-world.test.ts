import request from 'supertest';
import { print } from 'graphql';
import { expect } from 'chai';
import { gql } from 'apollo-server-express';

describe('GraphQL - Hello World resolver', () => {
  let requestUrl: string;

  const query = print(gql`
    query HelloWorld {
      helloWorld {
        helloWorld
      }
    }
  `);

  before(() => {
    requestUrl = `http://localhost:${process.env.PORT}`;
  });

  it('should return the string `Hello, World!`', async () => {
    const response = await request(requestUrl).post('/graphql').send({ query });

    expect(response.body.data.helloWorld.helloWorld).to.be.a('string');
    expect(response.body.data.helloWorld.helloWorld).be.eq('Hello, World!');
  });
});
