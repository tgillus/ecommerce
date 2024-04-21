import { Context, Effect, Layer } from 'effect';
import { UnknownException } from 'effect/Cause';
import { DynamoGateway } from '../../infrastructure/persistence/dynamo-gateway.js';
import { CreateArgs } from '../operation/args/create-args.js';
import { Probe } from '../probe/probe.js';

export class ProductService extends Context.Tag('ProductService')<
  ProductService,
  {
    create: (args: CreateArgs) => Effect.Effect<void, UnknownException>;
  }
>() {
  static build = () =>
    ProductServiceLive.pipe(Layer.provide(DynamoGateway.build()));
}

export const ProductServiceLive = Layer.effect(
  ProductService,
  Effect.gen(function* (_) {
    const dynamoGateway = yield* _(DynamoGateway);
    const probe = yield* _(Probe);

    return {
      create: ({ product }: CreateArgs) =>
        dynamoGateway.create(product).pipe(
          Effect.tapBoth({
            onFailure: probe.savingProductToDynamoFailed,
            onSuccess: probe.savingProductToDynamoSucceeded,
          })
        ),
    };
  })
);
