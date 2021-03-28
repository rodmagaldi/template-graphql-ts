import { Service } from 'typedi';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { SignUpInputType } from '@server/graphql/module/auth/input';
import { SignUpType } from '@server/graphql/module/auth/type';
import { SignUpModel } from '@server/domain/model';
import { SignUpUseCase } from '@server/domain/auth';

@Service()
@Resolver()
export class AuthResolver {
  constructor(private readonly signUpUseCase: SignUpUseCase) {}

  @Mutation(() => SignUpType, { description: 'Sign up' })
  signUp(@Arg('data') data: SignUpInputType): SignUpModel {
    return this.signUpUseCase.exec(data);
  }
}
