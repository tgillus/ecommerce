import { Context, Effect, Layer } from 'effect';
import { ServiceError } from '../../../../common/application/error/service-error.js';
import { ProductService } from '../../service/product-service.js';
import type { Handler } from '../operation.js';
import type { ReadArgs } from './read-args.js';

export class ReadHandler extends Context.Tag('Handler')<
  ReadHandler,
  Handler
>() {}

export const ReadHandlerLive = Layer.effect(
  ReadHandler,
  Effect.gen(function* () {
    const productService = yield* ProductService;

    return {
      exec: (args: ReadArgs) =>
        productService.read(args).pipe(
          Effect.catchTag('UnknownException', (error) =>
            Effect.fail(new ServiceError(error))
          ),
          Effect.andThen((productDto) => productDto.toJSON())
        ),
    };
  })
);
