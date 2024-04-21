import { Effect, Layer } from 'effect';
import { ProductService } from '../../service/product-service.js';
import { Handler } from './handler.js';

export const CreateHandlerLive = Layer.effect(
  Handler,
  Effect.gen(function* (_) {
    const productService = yield* _(ProductService);

    return {
      exec: productService.create,
    };
  })
);
