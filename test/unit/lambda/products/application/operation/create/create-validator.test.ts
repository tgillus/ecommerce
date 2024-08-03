import { Effect, Exit, Layer } from 'effect';
import assert from 'node:assert';
import { expect, test } from 'vitest';
import { ValidationError } from '../../../../../../../lib/lambda/common/application/error/validation-error.js';
import { RequestParams } from '../../../../../../../lib/lambda/common/request/request-params.js';
import { ProductEvent } from '../../../../../../../lib/lambda/products/application/event/product-event.js';
import {
  CreateValidator,
  CreateValidatorLive,
} from '../../../../../../../lib/lambda/products/application/operation/create/create-validator.js';
import { ProbeTest } from '../../../../../../../lib/lambda/products/application/probe/probe.js';
import { ProductServiceSuccessTest } from '../../../../../../../lib/lambda/products/application/service/product-service.js';
import type { Product } from '../../../../../../../lib/lambda/products/domain/model/product.js';

const program = (params: RequestParams) =>
  Effect.gen(function* () {
    const validator = yield* CreateValidator;
    return yield* validator.validate(params);
  });

test('validates create product params', async () => {
  const product = {
    description: 'foo',
    name: 'bar',
    price: '9.99',
  } satisfies Product;
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(
    Layer.provide(ProductServiceSuccessTest),
    Layer.provide(ProbeTest)
  );
  const runnable = Effect.provide(program(params), validator);

  expect(await Effect.runPromise(runnable)).toEqual({
    event: ProductEvent.CREATE_PRODUCT,
    product,
  });
});

test('requires description', async () => {
  const product = {
    name: 'foo',
    price: '9.99',
  } satisfies Omit<Product, 'description'>;
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(
    Layer.provide(ProductServiceSuccessTest),
    Layer.provide(ProbeTest)
  );
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: 'is missing',
          path: ['description'],
        },
      ])
    )
  );
});

test('requires name', async () => {
  const product = {
    description: 'foo',
    price: '9.99',
  } satisfies Omit<Product, 'name'>;
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(
    Layer.provide(ProductServiceSuccessTest),
    Layer.provide(ProbeTest)
  );
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: 'is missing',
          path: ['name'],
        },
      ])
    )
  );
});

test('requires price', async () => {
  const product = {
    description: 'foo',
    name: 'bar',
  } satisfies Omit<Product, 'price'>;
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(
    Layer.provide(ProductServiceSuccessTest),
    Layer.provide(ProbeTest)
  );
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: 'is missing',
          path: ['price'],
        },
      ])
    )
  );
});
