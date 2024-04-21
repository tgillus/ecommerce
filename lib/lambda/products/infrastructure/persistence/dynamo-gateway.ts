import { Config, Context, Effect, Layer } from 'effect';
import { UnknownException } from 'effect/Cause';
import {
  DynamoClient,
  DynamoClientLive,
} from '../../../common/vendor/dynamo/dynamo-client.js';
import { Product } from '../../domain/model/product.js';
import { ProductMapper, ProductMapperLive } from './product-mapper.js';

export class DynamoGateway extends Context.Tag('DynamoGateway')<
  DynamoGateway,
  {
    create: (product: Product) => Effect.Effect<void, UnknownException>;
  }
>() {
  static build = () =>
    DynamoGatewayLive.pipe(
      Layer.provide(Layer.merge(DynamoClientLive, ProductMapperLive))
    );
}

export const DynamoGatewayLive = Layer.effect(
  DynamoGateway,
  Effect.gen(function* (_) {
    const tableName = yield* _(Config.string('PRODUCTS_TABLE_NAME'));
    const client = yield* _(DynamoClient);
    const productMapper = yield* _(ProductMapper);

    return {
      create: (product) =>
        Effect.gen(function* (_) {
          const item = productMapper.map(product);
          yield* _(client.put(tableName, item));
        }),
    };
  })
);
