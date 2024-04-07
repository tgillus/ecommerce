import { Effect } from 'effect';
import { CreateArgs } from '../args/create-args.js';
import { Handler } from './handler.js';

export class CreateHandler implements Handler {
  handler = (args: CreateArgs): Effect.Effect<string, Error> =>
    Effect.succeed('success');
}
