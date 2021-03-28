import { ServerContext } from '@server/context';
import { BaseError, ErrorType } from '@server/error/error';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { Service } from 'typedi';

@Service()
export class AuthorizationMiddleware implements MiddlewareInterface<ServerContext> {
  async use({ context }: ResolverData<ServerContext>, next: NextFn) {
    const userId = context?.id;

    if (!userId) {
      throw new BaseError(ErrorType.UnauthorizedError, 'Usuário sem credenciais válidas.');
    }

    return next();
  }
}
