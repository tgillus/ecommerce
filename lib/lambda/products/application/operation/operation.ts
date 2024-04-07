import { Effect } from 'effect';
import { Handler } from './handler/handler.js';
import { Validator } from './validation/validator.js';

export interface Operation {
  exec(data: unknown): Effect.Effect<string, Error>;
}

export class ValidOperation implements Operation {
  constructor(
    private readonly validator: Validator,
    private readonly handler: Handler
  ) {}

  exec = (data: unknown) =>
    Effect.flatMap(this.validator.validate(data), this.handler.handle);
}

export class InvalidOperation implements Operation {
  exec = () => Effect.fail(new Error('invalid operation'));
}
