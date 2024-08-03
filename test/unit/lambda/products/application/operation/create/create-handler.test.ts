import { Effect, Exit, Layer } from 'effect';
import { UnknownException } from 'effect/Cause';
import assert from 'node:assert';
import { expect, test } from 'vitest';
import { ServiceError } from '../../../../../../../lib/lambda/common/application/error/service-error.js';
import { ProductEvent } from '../../../../../../../lib/lambda/products/application/event/product-event.js';
import type { CreateArgs } from '../../../../../../../lib/lambda/products/application/operation/create/create-args.js';
import {
  CreateHandler,
  CreateHandlerLive,
} from '../../../../../../../lib/lambda/products/application/operation/create/create-handler.js';
import {
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
