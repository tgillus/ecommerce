import { Context, type Effect } from 'effect';
import type { ServiceError } from '../../../../common/application/error/service-error.js';
import type { Args } from '../args/args.js';

export class Handler extends Context.Tag('Handler')<
  Handler,
  {
    exec: (args: Args) => Effect.Effect<void, ServiceError>;
  }
>() {}
