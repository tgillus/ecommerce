import { Effect, Layer } from 'effect';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { ProductEvent } from '../../../../../../lib/lambda/products/application/event/product-event.js';
import type { CreateArgs } from '../../../../../../lib/lambda/products/application/operation/create/create-args.js';
import type { ReadArgs } from '../../../../../../lib/lambda/products/application/operation/read/read-args.js';
import { ProbeTest } from '../../../../../../lib/lambda/products/application/probe/probe.js';
import {
  ProductService,
  ProductServiceLive,
} from '../../../../../../lib/lambda/products/application/service/product-service.js';
import { ProductDto } from '../../../../../../lib/lambda/products/domain/dto/product-dto.js';
import {
  DynamoGateway,
  DynamoGatewayTest,
} from '../../../../../../lib/lambda/products/infrastructure/persistence/dynamo-gateway.js';
import { IdGenerator } from '../../../../../../lib/vendor/id/id-generator.js';
import { Time } from '../../../../../../lib/vendor/type/time.js';

const program = (args: CreateArgs) =>
  Effect.gen(function* () {
    const productService = yield* ProductService;
    return yield* productService.create(args);
  });

const args = {
  event: ProductEvent.CREATE_PRODUCT,
  product: {
    description: 'foo',
    name: 'bar',
    price: '9.99',
  },
} satisfies CreateArgs;

beforeEach(() => {
  td.replace(IdGenerator, 'generate');
  td.replace(DynamoGateway, 'build');
  td.replace(Time, 'now');
});

afterEach(() => {
  td.reset();
});

test('builds a product service', async () => {
  const id = 'foo';
  td.when(IdGenerator.generate()).thenReturn(id);
  td.when(DynamoGateway.build()).thenReturn(DynamoGatewayTest);
  const runnable = program(args).pipe(
    Effect.provide(ProductService.build()),
    Effect.provide(ProbeTest)
  );

  expect(await Effect.runPromise(runnable)).toStrictEqual(id);
});

test('creates products', async () => {
  const id = 'foo';
  td.when(IdGenerator.generate()).thenReturn(id);
  const handler = ProductServiceLive.pipe(
    Layer.provide(DynamoGatewayTest),
    Layer.provide(ProbeTest)
  );
  const runnable = Effect.provide(program(args), handler);

  expect(await Effect.runPromise(runnable)).toStrictEqual(id);
});

test('retrieves products', async () => {
  const now = new Date();
  td.when(Time.now()).thenReturn(now);
  const program = (args: ReadArgs) =>
    Effect.gen(function* () {
      const productService = yield* ProductService;
      return yield* productService.read(args);
    });
  const productId = 'baz';
  const handler = ProductServiceLive.pipe(
    Layer.provide(DynamoGatewayTest),
    Layer.provide(ProbeTest)
  );
  const runnable = Effect.provide(
    program({
      event: ProductEvent.READ_PRODUCT,
      productId,
    }),
    handler
  );

  expect(await Effect.runPromise(runnable)).toStrictEqual(
    new ProductDto(
      {
        description: 'foo',
        name: 'bar',
        price: '9.99',
      },
      productId,
      now
    )
  );
});
