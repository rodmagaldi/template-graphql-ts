import { ServerContext } from '@server/context';
import { BaseError, ErrorType } from '@server/error/error';
import { MiddlewareFn } from 'type-graphql';

export const AuthorizationMiddleware: MiddlewareFn<ServerContext> = (action, next): Promise<any> => {
  console.log('1');

  const userId = action.context?.id;

  if (!userId) {
    throw new BaseError(ErrorType.UnauthorizedError, 'Usuário sem credenciais válidas.');
  }

  return next();
};
