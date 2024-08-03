import { Effect, Exit, Layer } from 'effect';
import { UnknownException } from 'effect/Cause';
import assert from 'node:assert';
import { expect, test } from 'vitest';
import { ServiceError } from '../../../../../../../lib/lambda/common/application/error/service-error.js';
import { ProductEvent } from '../../../../../../../lib/lambda/products/application/event/product-event.js';
import type { ReadArgs } from '../../../../../../../lib/lambda/products/application/operation/read/read-args.js';
import {
  ReadHandler,
  ReadHandlerLive,
} from '../../../../../../../lib/lambda/products/application/operation/read/read-handler.js';
import {
  ProductServiceFailureTest,
  ProductServiceSuccessTest,
} from '../../../../../../../lib/lambda/products/application/service/product-service.js';

const program = (args: ReadArgs) =>
  Effect.gen(function* () {
    const handler = yield* ReadHandler;
    return yield* handler.exec(args);
  });

const args = {
  event: ProductEvent.READ_PRODUCT,
  productId: 'foo',
} satisfies ReadArgs;

test('executes create handler', async () => {
  const handler = ReadHandlerLive.pipe(
    Layer.provide(ProductServiceSuccessTest)
  );
  const runnable = Effect.provide(program(args), handler);

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    description: 'foo',
    id: 'baz',
    name: 'bar',
    price: '9.99',
  });
});

test('maps errors to service errors', async () => {
  const handler = ReadHandlerLive.pipe(
    Layer.provide(ProductServiceFailureTest)
  );
  const runnable = Effect.provide(program(args), handler);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(new ServiceError(new UnknownException('foo')))
  );
});
