import { Effect } from 'effect';
import { RequestParams } from '../../../../common/request/request-params.js';
import { Args } from '../args/args.js';

export interface Validator {
  validate(params: RequestParams): Effect.Effect<Args, Error>;
}
