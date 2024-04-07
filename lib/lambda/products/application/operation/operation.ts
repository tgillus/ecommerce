import { Effect } from 'effect';
import { Handler, HandlerResult } from './handler/handler.js';
import { Validator } from './validation/validator.js';

export interface Operation {
  exec(data: unknown): Effect.Effect<HandlerResult, Error>;
}

export class ValidOperation implements Operation {
  constructor(
    private readonly validator: Validator,
    private readonly handler: Handler
  ) {}

  exec = (data: unknown) =>
    Effect.map(this.validator.validate(data), this.handler.handler);
}

export class InvalidOperation implements Operation {
  exec = () => Effect.fail(new Error('invalid operation'));
}
