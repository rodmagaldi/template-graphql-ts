import { LoginInputModel } from '@domain/model';
import { IsCpf } from '@graphql/common';
import { Field, InputType } from 'type-graphql';

@InputType({ description: 'Login' })
export class LoginInputType implements LoginInputModel {
  @Field({ description: 'CPF' })
  @IsCpf()
  cpf: string;

  @Field({ description: 'User password' })
  password: string;

  @Field({ description: 'Extends token duration', nullable: true })
  rememberMe?: boolean;
}
