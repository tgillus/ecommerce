import { Effect, Layer } from 'effect';
import { ServiceError } from '../../../../common/application/error/service-error.js';
import { ProductService } from '../../service/product-service.js';
import type { CreateArgs } from '../args/create-args.js';
import { Handler } from './handler.js';

export const CreateHandlerLive = Layer.effect(
  Handler,
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

export const CreateHandlerTest = Layer.succeed(Handler, {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exec: (_args: CreateArgs) => Effect.void,
});
