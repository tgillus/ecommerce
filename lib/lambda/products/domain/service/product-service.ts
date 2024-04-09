import { Effect } from 'effect';
import { CreateArgs } from '../../application/operation/args/create-args.js';

export interface ProductService {
  create: (args: CreateArgs) => Effect.Effect<void, Error>;
}
