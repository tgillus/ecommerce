import { Effect } from 'effect';
import { Args } from '../args/args.js';

export interface Validator {
  validate(data: unknown): Effect.Effect<Args, Error>;
}
