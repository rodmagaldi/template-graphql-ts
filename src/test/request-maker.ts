import { JwtService } from '@server/core/jwt/jwt.service';
import { ServerError } from '@server/error/error';
import { expect } from 'chai';
import { print } from 'graphql';
import request from 'supertest';
import { Container } from 'typedi';

export interface GraphQLResponse<T> extends request.Response {
  body: {
    data?: T;
    errors?: ServerError[];
  };
}

export class RequestMaker {
  token: string = null;

  jwtService = Container.get(JwtService);

  private readonly port: number = parseInt(process.env.PORT);

  /** Refreshes Client and User authentication token loging in with default user 'admin@taqtile.com'
   * Token can be ater accessed by local property `this.token`
   *
   * @param app Reference to Express application
   */
  refreshAuth(): string {
    const jwtResponse = this.jwtService.generateToken('1');

    expect(jwtResponse).to.not.have.lengthOf(0);

    this.token = jwtResponse;
    return this.token;
  }

  /** Remove User authentication token
   */
  removeAuth(): void {
    this.token = null;
  }

  /** Performs POST request to graphQL engine on express app
   *
   * @param query Query/mutation to be sent to GraphQL
   * @param variables Object to be send to graphQL as variables
   * @param expectedStatus Value to assert HTTP responsestatus. Defaults to undefined
   */
  async postGraphQL<T, I = any>(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    query: any,
    variables?: I,
    token?: string,
    expectedStatus = 200,
  ): Promise<GraphQLResponse<T>> {
    const agent = request(`http://localhost:${this.port}`).post('/graphql');

    if (token) {
      agent.set('Authorization', token);
    } else if (this.token) {
      agent.set('Authorization', this.token);
    }

    agent.set('Content-Type', 'application/json');

    // Check if gql-tag is being used
    if (query.kind === 'Document') {
      query = print(query);
    }

    return agent.send({ query, variables }).expect(this.checkStatus(expectedStatus));
  }

  private checkStatus(expectedStatus: number): (res) => any {
    const assertion = (res: any): void => {
      expect(res).to.be.not.undefined;
      expect(res.statusCode).to.equal(
        expectedStatus,
        `Response status does not match for ${res.req.method} ${res.req.path} \n ${JSON.stringify(res.body)}`,
      );
    };

    return assertion;
  }
}
