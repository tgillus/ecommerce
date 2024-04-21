import { Context, Effect } from 'effect';
import { ValidationError } from '../../../../common/application/error/validation-error.js';
import { RequestParams } from '../../../../common/request/request-params.js';
import { Args } from '../args/args.js';

export class Validator extends Context.Tag('Validator')<
  Validator,
  {
    validate: (params: RequestParams) => Effect.Effect<Args, ValidationError>;
  }
>() {}
