import { expect } from 'chai';
import { gql } from 'apollo-server-express';
import { RequestMaker } from '@test/request-maker';
import { HelloWorldModel } from '@server/domain/model';

describe('GraphQL - Hello World resolver', () => {
  const mockedUserId = '1';
  let requestMaker: RequestMaker;

  const query = gql`
    query HelloWorld {
      helloWorld {
        helloWorld
      }
    }
  `;

  before(() => {
    requestMaker = new RequestMaker();
  });

  beforeEach(() => {
    requestMaker.refreshAuth();
  });

  it('should return the string corresponding to user id', async () => {
    const response = await requestMaker.postGraphQL<{ helloWorld: HelloWorldModel }>(query);
    console.log(response.body);

    expect(response.body.data.helloWorld.helloWorld).to.be.a('string');
    expect(response.body.data.helloWorld.helloWorld).be.eq(mockedUserId);
  });

  it('should throw error for unauthenticated user', async () => {
    requestMaker.removeAuth();
    const response = await requestMaker.postGraphQL<{ helloWorld: HelloWorldModel }>(query);
    console.log(response.body);

    expect(response.body.data.helloWorld.helloWorld).to.be.a('string');
    expect(response.body.data.helloWorld.helloWorld).be.eq(mockedUserId);
  });
});
