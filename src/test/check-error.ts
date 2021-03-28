import { ErrorType } from '@server/error/error';
import { expect } from 'chai';
import { GraphQLResponse } from './request-maker';

export function checkError(res: GraphQLResponse<any>, errorType: ErrorType, code: number, message?: string): void {
  expect(res.body.data).to.be.null;
  expect(res.body.errors[0].name).to.be.eq(ErrorType[errorType]);
  expect(res.body.errors[0].code).to.be.eq(code);

  if (message) {
    expect(res.body.errors[0].message).to.be.eq(message);
  }
}
