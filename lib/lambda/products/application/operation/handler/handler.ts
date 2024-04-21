import { Context, Effect } from 'effect';
import { ServiceError } from '../../../../common/application/error/service-error.js';
import { Args } from '../args/args.js';

export class Handler extends Context.Tag('Handler')<
  Handler,
  {
    exec: (args: Args) => Effect.Effect<void, ServiceError>;
  }
>() {}
