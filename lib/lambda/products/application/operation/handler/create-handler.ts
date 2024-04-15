import { Effect, Layer } from 'effect';
import { ProductService } from '../../service/product-service.js';
import { CreateArgs } from '../args/create-args.js';
import { Handler } from './handler.js';

export const CreateHandlerLive = Layer.effect(
  Handler,
  Effect.gen(function* (_) {
    const productService = yield* _(ProductService);

    return {
      exec: (args: CreateArgs) => productService.create(args),
    };
  })
);
