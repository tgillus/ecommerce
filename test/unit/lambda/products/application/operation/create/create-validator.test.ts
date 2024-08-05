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
import { productFactory } from '../../../../../../factories/product-factory.js';

const program = (params: RequestParams) =>
  Effect.gen(function* () {
    const validator = yield* CreateValidator;
    return yield* validator.validate(params);
  });

test('builds a create validator', async () => {
  const product = productFactory.build();
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const runnable = program(params).pipe(
    Effect.provide(CreateValidator.build()),
    Effect.provide(ProbeTest)
  );

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    event: ProductEvent.CREATE_PRODUCT,
    product,
  });
});

test('validates create product params', async () => {
  const product = productFactory.build();
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    event: ProductEvent.CREATE_PRODUCT,
    product,
  });
});

test('trims white space from description', async () => {
  const description = '   foo   ';
  const product = productFactory.build({ description });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    event: ProductEvent.CREATE_PRODUCT,
    product: {
      ...product,
      description: description.trim(),
    },
  });
});

test('requires description', async () => {
  const product = productFactory.build({ description: undefined });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
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

test.each([
  {
    field: 'description',
    value: 0,
  },
])('enforces expected type on $field', async ({ field, value }) => {
  const product = productFactory.build({ [field]: value });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: `Expected string, actual ${value}`,
          path: [field],
        },
      ])
    )
  );
});

test('enforces min length on description', async () => {
  const product = productFactory.build({ description: '' });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: 'Expected a non empty string, actual ""',
          path: ['description'],
        },
      ])
    )
  );
});

test('enforces max length on description', async () => {
  const description = 'a'.repeat(3001);
  const product = productFactory.build({ description });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: `Expected a string at most 3000 character(s) long, actual "${description}"`,
          path: ['description'],
        },
      ])
    )
  );
});

test('trims white space from name', async () => {
  const name = '   bar   ';
  const product = productFactory.build({ name });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    event: ProductEvent.CREATE_PRODUCT,
    product: {
      ...product,
      name: name.trim(),
    },
  });
});

test('requires name', async () => {
  const product = productFactory.build({ name: undefined });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
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

test.each([
  {
    field: 'name',
    value: 0,
  },
])('enforces expected type on $field', async ({ field, value }) => {
  const product = productFactory.build({ [field]: value });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: `Expected string, actual ${value}`,
          path: [field],
        },
      ])
    )
  );
});

test('enforces min length on name', async () => {
  const product = productFactory.build({ name: '' });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: 'Expected a non empty string, actual ""',
          path: ['name'],
        },
      ])
    )
  );
});

test('enforces max length on name', async () => {
  const name = 'a'.repeat(101);
  const product = productFactory.build({ name });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: `Expected a string at most 100 character(s) long, actual "${name}"`,
          path: ['name'],
        },
      ])
    )
  );
});

test('trims white space from price', async () => {
  const price = '   9.99   ';
  const product = productFactory.build({ price });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    event: ProductEvent.CREATE_PRODUCT,
    product: {
      ...product,
      price: price.trim(),
    },
  });
});

test('requires price', async () => {
  const product = productFactory.build({ price: undefined });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
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

test.each([
  {
    field: 'price',
    value: 0,
  },
])('enforces expected type on $field', async ({ field, value }) => {
  const product = productFactory.build({ [field]: value });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: `Expected string, actual ${value}`,
          path: [field],
        },
      ])
    )
  );
});

test('enforces dollar amount on price', async () => {
  const price = '100000.99';
  const product = productFactory.build({ price });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: `Expected a string matching the pattern ^\\d{1,5}\\.\\d{2}$, actual "${price}"`,
          path: ['price'],
        },
      ])
    )
  );
});

test('enforces fractional amount on price', async () => {
  const price = '9.990';
  const product = productFactory.build({ price });
  const params = new RequestParams({
    body: JSON.stringify(product),
    httpMethod: 'POST',
    pathParameters: null,
  });
  const validator = CreateValidatorLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), validator);

  assert.deepStrictEqual(
    await Effect.runPromiseExit(runnable),
    Exit.fail(
      new ValidationError([
        {
          message: `Expected a string matching the pattern ^\\d{1,5}\\.\\d{2}$, actual "${price}"`,
          path: ['price'],
        },
      ])
    )
  );
});
