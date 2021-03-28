import { formatError, GraphQLFormattedError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';

enum StatusCode {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ConflictError = 409,
  ServerError = 500,
  BadGateway = 502,
  ServiceUnavailableError = 503,
}

export enum ErrorType {
  BadGateway = StatusCode.BadGateway,
  ConflictError = StatusCode.ConflictError,
  DataSourceError = StatusCode.ServerError,
  ForbiddenError = StatusCode.Forbidden,
  InvalidDataError = StatusCode.BadRequest,
  BadRequest = StatusCode.BadRequest,
  NotFoundError = StatusCode.NotFound,
  ServerError = StatusCode.ServerError,
  ServiceUnavailableError = StatusCode.ServiceUnavailableError,
  UnauthorizedError = StatusCode.Unauthorized,
}

export class BaseError<T = any> extends Error {
  base = true;
  code: ErrorType | StatusCode;
  details?: T;
  errors?: any;

  constructor(type: ErrorType | StatusCode, message?: string, details?: T) {
    super(message);

    this.code = type;
    this.name = ErrorType[type];
    this.message = message;
    this.details = details;
  }
}

export interface ServerError extends GraphQLFormattedError {
  code?: number;
  name?: string;
  details?: ArgumentValidationError | string;
}

export function errorFormatter(error: { originalError: any }): ServerError {
  let data: ServerError = defaultErrorFormatter(error);
  const { originalError } = error;

  let details: ArgumentValidationError | string;
  if (originalError?.base) {
    details = originalError.details;
    data = {
      ...data,
      code: originalError.code,
      name: originalError.name,
      message: originalError.message,
    };
  } else if (originalError instanceof ArgumentValidationError) {
    const firstMessageParsed = Object.values(originalError.validationErrors?.[0].constraints)?.[0];
    details = originalError;
    data = {
      ...data,
      code: 400,
      name: 'InvalidDataError',
      message: firstMessageParsed ?? 'global.error.invalid-data',
    };
  }

  if (details && process.env.NODE_ENV === 'development') {
    data.details = details;
  }

  let extensions = {};
  const showExtensions = process.env.ERROR_SHOW_EXTENSIONS;
  if (showExtensions === 'true') {
    extensions = data.extensions;
  }

  return {
    ...data,
    extensions,
  };
}

export function defaultErrorFormatter(error) {
  const data: ServerError = formatError(error);

  if (error?.originalError?.result?.errors?.length === 1) {
    const originalError = error.originalError.result.errors[0];
    if (originalError.message === error.message) {
      if (originalError.code) {
        data.code = originalError.code;
      }
    }
  }

  return data;
}
