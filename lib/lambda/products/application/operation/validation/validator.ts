import { Context, type Effect } from 'effect';
import type { ValidationError } from '../../../../common/application/error/validation-error.js';
import type { RequestParams } from '../../../../common/request/request-params.js';
import type { Args } from '../args/args.js';

export class Validator extends Context.Tag('Validator')<
  Validator,
  {
    validate: (params: RequestParams) => Effect.Effect<Args, ValidationError>;
  }
>() {}
