import { Effect } from 'effect';
import { Args } from '../args/args.js';

export interface Handler {
  handle(args: Args): Effect.Effect<string, Error>;
}
