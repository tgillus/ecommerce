import { ConfigProvider, Effect, Exit } from 'effect';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { NotFoundError } from '../../../../../../lib/lambda/common/application/error/not-found-error.js';
import {
  DynamoClient,
  DynamoClientFailureTest,
  DynamoClientSuccessTest,
} from '../../../../../../lib/lambda/common/vendor/dynamo/dynamo-client.js';
import { ProductDto } from '../../../../../../lib/lambda/products/domain/dto/product-dto.js';
import {
  DynamoGateway,
  DynamoGatewayLive,
} from '../../../../../../lib/lambda/products/infrastructure/persistence/dynamo-gateway.js';
import { ProductMapperLive } from '../../../../../../lib/lambda/products/infrastructure/persistence/product-mapper.js';
import { Time } from '../../../../../../lib/vendor/type/time.js';

const configProvider = ConfigProvider.fromMap(
  new Map([['PRODUCTS_TABLE_NAME', 'foo']])
);
const now = new Date();
const product = new ProductDto(
  {
    description: 'bar',
    name: 'baz',
    price: '9.99',
  },
  'qux',
  now
);

beforeEach(() => {
  td.replace(DynamoClient, 'build');
  td.replace(Time, 'now');
});

afterEach(() => {
  td.reset();
});

test('builds a dynamo gateway', async () => {
  td.when(DynamoClient.build()).thenReturn(DynamoClientSuccessTest);
  const program = Effect.gen(function* () {
    const dynamoGateway = yield* DynamoGateway;
    return yield* dynamoGateway.create(product);
  });
  const runnable = program.pipe(
    Effect.provide(DynamoGateway.build()),
    Effect.withConfigProvider(configProvider)
  );

  expect(await Effect.runPromiseExit(runnable)).toStrictEqual(Exit.void);
});

test('saves products to dynamo', async () => {
  const program = Effect.gen(function* () {
    const dynamoGateway = yield* DynamoGateway;
    return yield* dynamoGateway.create(product);
  });
  const runnable = program.pipe(
    Effect.provide(DynamoGatewayLive),
    Effect.provide(DynamoClientSuccessTest),
    Effect.provide(ProductMapperLive),
    Effect.withConfigProvider(configProvider)
  );

  expect(await Effect.runPromiseExit(runnable)).toStrictEqual(Exit.void);
});

test('retrieves products from dynamo', async () => {
  td.when(Time.now()).thenReturn(now);
  const productId = 'bar';
  const program = Effect.gen(function* () {
    const dynamoGateway = yield* DynamoGateway;
    return yield* dynamoGateway.get(productId);
  });
  const runnable = program.pipe(
    Effect.provide(DynamoGatewayLive),
    Effect.provide(DynamoClientSuccessTest),
    Effect.provide(ProductMapperLive),
    Effect.withConfigProvider(configProvider)
  );

  expect(await Effect.runPromise(runnable)).toStrictEqual(
    new ProductDto(
      {
        description: 'foo',
        name: 'baz',
        price: '9.99',
      },
      'bar',
      now
    )
  );
});

test('returns not found error when products not found in dynamo', async () => {
  td.when(Time.now()).thenReturn(now);
  const productId = 'bar';
  const program = Effect.gen(function* () {
    const dynamoGateway = yield* DynamoGateway;
    return yield* dynamoGateway.get(productId);
  });
  const runnable = program.pipe(
    Effect.provide(DynamoGatewayLive),
    Effect.provide(DynamoClientFailureTest),
    Effect.provide(ProductMapperLive),
    Effect.withConfigProvider(configProvider)
  );

  expect(await Effect.runPromiseExit(runnable)).toStrictEqual(
    Exit.fail(new NotFoundError('product not found'))
  );
});
