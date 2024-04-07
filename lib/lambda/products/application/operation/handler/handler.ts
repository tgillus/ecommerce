import { Effect } from 'effect';
import { Args } from '../args/args.js';

export interface Handler {
  exec(args: Args): Effect.Effect<void, Error>;
}
