import { Effect } from 'effect';
import { Args } from '../args/args.js';

export interface Handler {
  handler(args: Args): HandlerResult;
}

export type HandlerResult = Effect.Effect<string, Error>;
