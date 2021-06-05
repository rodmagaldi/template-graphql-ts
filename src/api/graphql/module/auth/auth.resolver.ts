import { Service } from 'typedi';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { LoginInputType, SignUpInputType } from '@graphql/module/auth/input';
import { LoginType } from '@graphql/module/auth/type';
import { LoginModel } from '@domain/model';
import { SignUpUseCase, LoginUseCase } from '@domain/auth';

@Service()
@Resolver()
export class AuthResolver {
  constructor(private readonly signUpUseCase: SignUpUseCase, private loginUseCase: LoginUseCase) {}

  @Mutation(() => LoginType, { description: 'Sign up' })
  signUp(@Arg('data') data: SignUpInputType): Promise<LoginModel> {
    return this.signUpUseCase.exec(data);
  }

  @Mutation(() => LoginType, { description: 'Login' })
  login(@Arg('data') data: LoginInputType): Promise<LoginModel> {
    return this.loginUseCase.exec(data);
  }
}
