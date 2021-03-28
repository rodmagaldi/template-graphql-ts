import { Service } from 'typedi';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { HelloWorldModel } from '@domain/model';
import { HelloWorldUseCase } from '@domain/hello-world';
import { HelloWorldType } from '@server/graphql/module/hello-world/type';
import { ServerContext } from '@server/context';
import { AuthorizationMiddleware } from '@server/auth.middleware';

@Service()
@Resolver()
export class HelloWordResolver {
  constructor(private readonly helloWorldUseCase: HelloWorldUseCase) {}

  @Query(() => HelloWorldType, { description: 'Hello world' })
  @UseMiddleware(AuthorizationMiddleware)
  helloWorld(@Ctx() context: ServerContext): HelloWorldModel {
    return this.helloWorldUseCase.exec(context.id);
  }
}
