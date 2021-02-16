import { Service } from 'typedi';
import { HelloWorldModel } from 'domain/model/hello-world.model';
import { Query, Resolver } from 'type-graphql';
import { HelloWorldType } from './type/hello-world.type';
import { HelloWorldUseCase } from 'domain/hello-world/hello-world.use-case';

@Service()
@Resolver()
export class HelloWordResolver {
  constructor(private readonly helloWorldUseCase: HelloWorldUseCase) {}

  @Query(() => HelloWorldType, { description: 'Hello world' })
  helloWorld(): HelloWorldModel {
    return this.helloWorldUseCase.exec();
  }
}
