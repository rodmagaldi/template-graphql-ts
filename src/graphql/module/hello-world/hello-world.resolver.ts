import { Service } from 'typedi';
import { Query, Resolver } from 'type-graphql';
import { HelloWorldModel } from '@domain/model';
import { HelloWorldUseCase } from '@domain/hello-world';
import { HelloWorldType } from '@server/graphql/module/hello-world/type';

@Service()
@Resolver()
export class HelloWordResolver {
  constructor(private readonly helloWorldUseCase: HelloWorldUseCase) {}

  @Query(() => HelloWorldType, { description: 'Hello world' })
  helloWorld(): HelloWorldModel {
    return this.helloWorldUseCase.exec();
  }
}
