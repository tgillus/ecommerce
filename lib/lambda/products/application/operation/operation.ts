import { Effect } from 'effect';
import { RequestParams } from '../../../common/request/request-params.js';
import { Handler } from './handler/handler.js';
import { Validator } from './validation/validator.js';

export interface Operation {
  exec(params: RequestParams): Effect.Effect<void, Error>;
}

export class ValidOperation implements Operation {
  constructor(
    private readonly validator: Validator,
    private readonly handler: Handler
  ) {}

  exec = (params: RequestParams) =>
    Effect.flatMap(this.validator.validate(params), this.handler.exec);
}

export class InvalidOperation implements Operation {
  exec = () => Effect.fail(new Error('invalid operation'));
}
