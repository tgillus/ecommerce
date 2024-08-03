import { Effect, Exit, Layer } from 'effect';
import assert from 'node:assert';
import { expect, test } from 'vitest';
import { ValidationError } from '../../../../../../../lib/lambda/common/application/error/validation-error.js';
import { RequestParams } from '../../../../../../../lib/lambda/common/request/request-params.js';
import { ProductEvent } from '../../../../../../../lib/lambda/products/application/event/product-event.js';
import {
  ReadValidator,
  ReadValidatorLive,
} from '../../../../../../../lib/lambda/products/application/operation/read/read-validator.js';
import { ProbeTest } from '../../../../../../../lib/lambda/products/application/probe/probe.js';

const program = (params: RequestParams) =>
  Effect.gen(function* () {
    const validator = yield* ReadValidator;
    return yield* validator.validate(params);
  });

test('builds a create validator', async () => {
  const productId = 'foo';
  const params = new RequestParams({
    body: null,
    httpMethod: 'GET',
    pathParameters: { productId },
  });
  const runnable = program(params).pipe(
    Effect.provide(ReadValidator.build()),
    Effect.provide(ProbeTest)
  );

  expect(await Effect.runPromise(runnable)).toEqual({
    event: ProductEvent.READ_PRODUCT,
    productId,
  });
});

test('validates read product params', async () => {
  const productId = 'foo';
  const params = new RequestParams({
    body: null,
    httpMethod: 'GET',
    pathParameters: { productId },
  });
  const validator = ReadValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  expect(await Effect.runPromise(runnable)).toEqual({
    event: ProductEvent.READ_PRODUCT,
    productId,
  });
});

test('requires product id', async () => {
  const params = new RequestParams({
    body: null,
    httpMethod: 'GET',
    pathParameters: null,
  });
  const validator = ReadValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: 'is missing',
          path: ['productId'],
        },
      ])
    )
  );
});
