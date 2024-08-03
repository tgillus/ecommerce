import { Effect, Exit, Layer } from 'effect';
import { UnknownException } from 'effect/Cause';
import assert from 'node:assert';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { ServiceError } from '../../../../../../../lib/lambda/common/application/error/service-error.js';
import { ProductEvent } from '../../../../../../../lib/lambda/products/application/event/product-event.js';
import type { CreateArgs } from '../../../../../../../lib/lambda/products/application/operation/create/create-handler.js';
import {
  CreateHandler,
  CreateHandlerLive,
} from '../../../../../../../lib/lambda/products/application/operation/create/create-handler.js';
import { ProbeTest } from '../../../../../../../lib/lambda/products/application/probe/probe.js';
import {
  ProductService,
  ProductServiceFailureTest,
  ProductServiceSuccessTest,
} from '../../../../../../../lib/lambda/products/application/service/product-service.js';

const program = (args: CreateArgs) =>
  Effect.gen(function* () {
    const handler = yield* CreateHandler;
    return yield* handler.exec(args);
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
  td.replace(ProductService, 'build');
});

afterEach(() => {
  td.reset();
});

test('builds a create handler', async () => {
  td.when(ProductService.build()).thenReturn(ProductServiceSuccessTest);
  const runnable = program(args).pipe(
    Effect.provide(CreateHandler.build()),
    Effect.provide(ProbeTest)
  );

  expect(await Effect.runPromise(runnable)).toStrictEqual({ id: 'foo' });
});

test('executes create handler', async () => {
  const handler = CreateHandlerLive.pipe(
    Layer.provide(ProductServiceSuccessTest)
  );
  const runnable = Effect.provide(program(args), handler);

  expect(await Effect.runPromise(runnable)).toStrictEqual({ id: 'foo' });
});

test('maps errors to service errors', async () => {
  const handler = CreateHandlerLive.pipe(
    Layer.provide(ProductServiceFailureTest)
  );
  const runnable = Effect.provide(program(args), handler);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(new ServiceError(new UnknownException('foo')))
  );
});
