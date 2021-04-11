import { LoginModel } from '@server/domain/model';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Login' })
export class LoginType implements LoginModel {
  @Field({ description: 'JWT' })
  token: string;
}
