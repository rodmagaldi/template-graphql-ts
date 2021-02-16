import { HelloWorldModel } from 'domain/model/hello-world.model';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Sample hello world query' })
export class HelloWorldType implements HelloWorldModel {
  @Field({ description: 'Sample text return' })
  helloWorld: string;
}
