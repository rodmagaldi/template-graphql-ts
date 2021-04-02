import { expect } from 'chai';
import { gql } from 'apollo-server-express';
import { RequestMaker } from '@test/request-maker';
import { LoginModel, SignUpInputModel } from '@server/domain/model';
import { checkError, checkValidationError } from '@test/check-error';
import { ErrorType, StatusCode } from '@server/error/error';
import { getRepository, Repository } from 'typeorm';
import { User } from '@server/data/db/entity';
import * as cpf from 'cpf';
import { internet, name } from 'faker';
import { JwtService } from '@server/core/jwt/jwt.service';
import Container from 'typedi';
import { AuthDatasource } from '@server/data/source/auth.datasource';
import { mockUsers } from '@server/test/mock';

describe('GraphQL - Auth Resolver - Sign Up', () => {
  let requestMaker: RequestMaker;
  let userRespository: Repository<User>;
  let authDatasource: AuthDatasource;
  let jwtService: JwtService;
  const uuidRE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  const query = gql`
    mutation SignUp($data: SignUpInputType!) {
      signUp(data: $data) {
        token
      }
    }
  `;

  before(() => {
    requestMaker = new RequestMaker();
    userRespository = getRepository(User);
    authDatasource = Container.get(AuthDatasource);
    jwtService = Container.get(JwtService);
  });

  afterEach(async () => {
    await userRespository.clear();
  });

  it('should successfully register user', async () => {
    const response = await requestMaker.postGraphQL<{ signUp: LoginModel }, { data: SignUpInputModel }>(query, {
      data: {
        cpf: cpf.generate(false),
        email: internet.email(),
        firstName: name.firstName(),
        lastName: name.lastName(),
        password: internet.password(),
      },
    });

    const token = response.body.data.signUp.token;
    expect(token).to.be.a('string');
    expect(token.split(' ')[0]).to.be.eq('Bearer');
    const decodedToken = jwtService.verifyToken(token);
    expect(uuidRE.test(decodedToken.data.id)).to.true;

    const newUser = await authDatasource.findUserById(decodedToken.data.id);
    expect(newUser.id).to.eq(decodedToken.data.id);
  });

  it('should throw error for invalid cpf', async () => {
    const response = await requestMaker.postGraphQL<{ signUp: LoginModel }, { data: SignUpInputModel }>(query, {
      data: {
        cpf: '12312312312',
        email: internet.email(),
        firstName: name.firstName(),
        lastName: name.lastName(),
        password: internet.password(),
      },
    });

    checkValidationError(response, 'InvalidDataError', StatusCode.BadRequest, 'CPF inválido.');
  });

  it('should throw error for invalid cpf format', async () => {
    const response = await requestMaker.postGraphQL<{ signUp: LoginModel }, { data: SignUpInputModel }>(query, {
      data: {
        cpf: cpf.generate(),
        email: internet.email(),
        firstName: name.firstName(),
        lastName: name.lastName(),
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

  it('should throw error for cpf already in use', async () => {
    const sampleCpf = cpf.generate(false);
    await mockUsers(1, { userCpf: sampleCpf });
    const response = await requestMaker.postGraphQL<{ signUp: LoginModel }, { data: SignUpInputModel }>(query, {
      data: {
        cpf: sampleCpf,
        email: internet.email(),
        firstName: name.firstName(),
        lastName: name.lastName(),
        password: internet.password(),
      },
    });

    checkError(response, ErrorType.ConflictError, StatusCode.ConflictError, 'Usuário com este email ou CPF já existe.');
  });

  it('should throw error for invalid email', async () => {
    const response = await requestMaker.postGraphQL<{ signUp: LoginModel }, { data: SignUpInputModel }>(query, {
      data: {
        cpf: cpf.generate(false),
        email: 'invalidemail',
        firstName: name.firstName(),
        lastName: name.lastName(),
        password: internet.password(),
      },
    });

    checkValidationError(response, 'InvalidDataError', StatusCode.BadRequest, 'E-mail inválido.');
  });

  it('should throw error for cpf already in use', async () => {
    const sampleEmail = internet.email();
    await mockUsers(1, { userEmail: sampleEmail });
    const response = await requestMaker.postGraphQL<{ signUp: LoginModel }, { data: SignUpInputModel }>(query, {
      data: {
        cpf: cpf.generate(false),
        email: sampleEmail,
        firstName: name.firstName(),
        lastName: name.lastName(),
        password: internet.password(),
      },
    });

    checkError(response, ErrorType.ConflictError, StatusCode.ConflictError, 'Usuário com este email ou CPF já existe.');
  });
});
