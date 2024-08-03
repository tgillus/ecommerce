import { Context, type Effect } from 'effect';
import type { InvalidOperationError } from '../../../common/application/error/invalid-operation-error.js';
import type { NotFoundError } from '../../../common/application/error/not-found-error.js';
import type { ServiceError } from '../../../common/application/error/service-error.js';
import type { ValidationError } from '../../../common/application/error/validation-error.js';
import type { RequestParams } from '../../../common/request/request-params.js';
import type { CreateArgs } from './create/create-handler.js';
import type { ReadArgs } from './read/read-handler.js';

export class Operation extends Context.Tag('Operation')<
  Operation,
  {
    exec(
      params: RequestParams
    ): Effect.Effect<
      Record<string, unknown>,
      InvalidOperationError | NotFoundError | ServiceError | ValidationError
    >;
  }
>() {}

type Args = CreateArgs | ReadArgs;

export interface Validator {
  validate(params: RequestParams): Effect.Effect<Args, ValidationError>;
}

export interface Handler {
  exec(
    args: Args
  ): Effect.Effect<Record<string, unknown>, NotFoundError | ServiceError>;
}
