import { SignUpInputModel } from '@server/domain/model';
import { IsCpf } from '@graphql/common';
import { Field, InputType } from 'type-graphql';
import { IsEmail } from 'class-validator';

@InputType({ description: 'Sign up' })
export class SignUpInputType implements SignUpInputModel {
  @Field({ description: 'CPF' })
  @IsCpf()
  cpf: string;

  @Field({ description: 'User email' })
  @IsEmail(undefined, { message: 'E-mail inválido.' })
  email: string;

  @Field({ description: 'User password' })
  password: string;

  @Field({ description: 'User first name' })
  firstName: string;

  @Field({ description: 'User last name' })
  lastName: string;
}
