import { Context, Effect } from 'effect';
import { Args } from '../args/args.js';

export class Handler extends Context.Tag('Handler')<
  Handler,
  {
    exec: (args: Args) => Effect.Effect<void, Error>;
  }
>() {}
