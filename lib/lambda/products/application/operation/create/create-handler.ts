import { Context, Effect, Layer } from 'effect';
import { ServiceError } from '../../../../common/application/error/service-error.js';
import { ProductService } from '../../service/product-service.js';
import type { CreateArgs } from '../create/create-args.js';
import type { Handler } from '../operation.js';

export class CreateHandler extends Context.Tag('Handler')<
  CreateHandler,
  Handler
>() {}

export const CreateHandlerLive = Layer.effect(
  CreateHandler,
  Effect.gen(function* () {
    const productService = yield* ProductService;

    return {
      exec: (args: CreateArgs) =>
        productService
          .create(args)
          .pipe(Effect.mapError((error) => new ServiceError(error))),
    };
  })
);

export const CreateHandlerTest = Layer.succeed(CreateHandler, {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exec: (_args: CreateArgs) => Effect.void,
});
