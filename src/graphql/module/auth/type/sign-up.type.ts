import { SignUpModel } from '@server/domain/model';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Sing up' })
export class SignUpType implements SignUpModel {
  @Field({ description: 'CPF' })
  cpf: string;
}
