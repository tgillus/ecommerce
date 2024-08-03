import { Context, Effect, Layer } from 'effect';
import type { UnknownException } from 'effect/Cause';
import { IdGenerator } from '../../../../vendor/id/id-generator.js';
import type { NotFoundError } from '../../../common/application/error/not-found-error.js';
import { ProductDto } from '../../domain/dto/product-dto.js';
import { DynamoGateway } from '../../infrastructure/persistence/dynamo-gateway.js';
import type { CreateArgs } from '../operation/create/create-args.js';
import type { ReadArgs } from '../operation/read/read-args.js';
import { Probe } from '../probe/probe.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProductService extends Context.Tag('ProductService')<
  ProductService,
  {
    create: (args: CreateArgs) => Effect.Effect<string, UnknownException>;
    read: (
      args: ReadArgs
    ) => Effect.Effect<ProductDto, NotFoundError | UnknownException>;
  }
>() {
  static build() {
    return ProductServiceLive.pipe(Layer.provide(DynamoGateway.build()));
  }
}

const ProductServiceLive = Layer.effect(
  ProductService,
  Effect.gen(function* () {
    const dynamoGateway = yield* DynamoGateway;
    const probe = yield* Probe;

    return {
      create: ({ product }: CreateArgs) => {
        const productId = IdGenerator.generate();

        return dynamoGateway
          .create(new ProductDto(product, productId, new Date()))
          .pipe(
            Effect.tapBoth({
              onFailure: probe.savingProductToDynamoFailed,
              onSuccess: probe.savingProductToDynamoSucceeded,
            }),
            Effect.andThen(() => productId)
          );
      },
      read: ({ productId }: ReadArgs) =>
        dynamoGateway.get(productId).pipe(
          Effect.tapBoth({
            onFailure: probe.readingProductFromDynamoFailed,
            onSuccess: probe.readingProductFromDynamoSucceeded,
          })
        ),
    };
  })
);
