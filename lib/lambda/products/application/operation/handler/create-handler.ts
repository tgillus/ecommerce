import { Effect } from 'effect';
import { CreateArgs } from '../args/create-args.js';
import { Handler } from './handler.js';

export class CreateHandler implements Handler {
  exec = (args: CreateArgs): Effect.Effect<void, Error> =>
    Effect.succeed('success');
}
