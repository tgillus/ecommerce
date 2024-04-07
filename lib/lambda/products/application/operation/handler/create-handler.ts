import { Effect } from 'effect';
import { CreateArgs } from '../args/create-args.js';
import { Handler } from './handler.js';

export class CreateHandler implements Handler {
  handle = (args: CreateArgs): Effect.Effect<string, Error> =>
    Effect.succeed('success');
}
