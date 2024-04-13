import { Context, Effect, Layer } from 'effect';
import { UnknownException } from 'effect/Cause';
import { DynamoGateway } from '../../infrastructure/dynamo/dynamo-gateway.js';
import { CreateArgs } from '../operation/args/create-args.js';

export class ProductService extends Context.Tag('ProductService')<
  ProductService,
  {
    create: (args: CreateArgs) => Effect.Effect<void, UnknownException>;
  }
>() {}

export const ProductServiceLive = Layer.effect(
  ProductService,
  Effect.gen(function* (_) {
    const dynamoGateway = yield* _(DynamoGateway);

    return {
      create: ({ product }: CreateArgs) => dynamoGateway.create(product),
    };
  })
);
