import { expect } from 'chai';
import { gql } from 'apollo-server-express';
import { RequestMaker } from '@test/request-maker';
import { LoginInputModel, LoginModel } from '@server/domain/model';
import { checkError, checkValidationError } from '@test/check-error';
import { ErrorType, StatusCode } from '@server/error/error';
import { getRepository, Repository } from 'typeorm';
import { User } from '@server/data/db/entity';
import * as cpf from 'cpf';
import { internet } from 'faker';
import { JwtService } from '@server/core/jwt/jwt.service';
import Container from 'typedi';
import { mockUsers } from '@server/test/mock';

describe('GraphQL - Auth Resolver - Login', () => {
  let requestMaker: RequestMaker;
  let userRespository: Repository<User>;
  let jwtService: JwtService;
  const uuidRE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

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
    jwtService = Container.get(JwtService);
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
    const response = await requestMaker.postGraphQL<{ login: LoginModel }, { data: LoginInputModel }>(query, {
      data: {
        cpf: sampleCpf,
        password: samplePassword,
      },
    });

    console.log(response.body);

    const token = response.body.data.login.token;
    expect(token).to.be.a('string');
    expect(token.split(' ')[0]).to.be.eq('Bearer');
    const decodedToken = jwtService.verifyToken(token);
    expect(uuidRE.test(decodedToken.data.id)).to.true;
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
