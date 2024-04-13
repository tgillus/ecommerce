import { Context, Effect, Layer } from 'effect';
import { ProductService } from '../../service/product-service.js';
import { CreateArgs } from '../args/create-args.js';

export class CreateHandler extends Context.Tag('CreateHandler')<
  CreateHandler,
  {
    exec: (args: CreateArgs) => Effect.Effect<void, Error>;
  }
>() {}

export const CreateHandlerLive = Layer.effect(
  CreateHandler,
  Effect.gen(function* (_) {
    const productService = yield* _(ProductService);

    return {
      exec: (args: CreateArgs) => productService.create(args),
    };
  })
);
