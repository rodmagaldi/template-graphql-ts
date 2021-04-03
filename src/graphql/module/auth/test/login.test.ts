import { gql } from 'apollo-server-express';
import { RequestMaker } from '@test/request-maker';
import { LoginInputModel, LoginModel } from '@server/domain/model';
import { checkError, checkJWT, checkValidationError } from '@server/test/checker';
import { ErrorType, StatusCode } from '@server/error/error';
import { getRepository, Repository } from 'typeorm';
import { User } from '@server/data/db/entity';
import * as cpf from 'cpf';
import { internet } from 'faker';
import { mockUsers } from '@server/test/mock';

describe('GraphQL - Auth Resolver - Login', () => {
  let requestMaker: RequestMaker;
  let userRespository: Repository<User>;

  const query = gql`
    mutation Login($data: LoginInputType!) {
      login(data: $data) {
        token
      }
    }
  `;

  before(async () => {
    requestMaker = new RequestMaker();
    userRespository = getRepository(User);
    await userRespository.clear();
  });

  beforeEach(async () => {
    await userRespository.clear();
  });

  afterEach(async () => {
    await userRespository.clear();
  });

  after(async () => {
    await userRespository.clear();
  });

  it('should successfully login user', async () => {
    const sampleCpf = cpf.generate(false);
    const samplePassword = internet.password();
    mockUsers(1, { userCpf: sampleCpf, userPassword: samplePassword });
    let response = await requestMaker.postGraphQL<{ login: LoginModel }, { data: LoginInputModel }>(query, {
      data: {
        cpf: sampleCpf,
        password: samplePassword,
      },
    });
    let token = response.body.data.login.token;
    checkJWT(token);

    response = await requestMaker.postGraphQL<{ login: LoginModel }, { data: LoginInputModel }>(query, {
      data: {
        cpf: sampleCpf,
        password: samplePassword,
        rememberMe: true,
      },
    });
    token = response.body.data.login.token;
    checkJWT(token, true);
  });

  it('should throw error for unsuccessful login (wrong cpf)', async () => {
    const sampleCpf = cpf.generate(false);
    const samplePassword = internet.password();
    mockUsers(1, { userCpf: sampleCpf, userPassword: samplePassword });
    const response = await requestMaker.postGraphQL<{ login: LoginModel }, { data: LoginInputModel }>(query, {
      data: {
        cpf: cpf.generate(false),
        password: samplePassword,
      },
    });

    checkError(response, ErrorType.NotFoundError, StatusCode.NotFound, 'Combinação email/senha inexistente.');
  });

  it('should throw error for unsuccessful login (wrong password)', async () => {
    const sampleCpf = cpf.generate(false);
    const samplePassword = internet.password();
    mockUsers(1, { userCpf: sampleCpf, userPassword: samplePassword });
    const response = await requestMaker.postGraphQL<{ login: LoginModel }, { data: LoginInputModel }>(query, {
      data: {
        cpf: sampleCpf,
        password: internet.password(),
      },
    });

    checkError(response, ErrorType.NotFoundError, StatusCode.NotFound, 'Combinação email/senha inexistente.');
  });

  it('should throw error for invalid cpf format', async () => {
    const response = await requestMaker.postGraphQL<{ login: LoginModel }, { data: LoginInputModel }>(query, {
      data: {
        cpf: cpf.generate(),
        password: internet.password(),
      },
    });

    checkValidationError(
      response,
      'InvalidDataError',
      StatusCode.BadRequest,
      'Formato do CPF inválido, utilize apenas os dígitos.',
    );
  });
});
