import { Effect, Exit, Layer } from 'effect';
import assert from 'node:assert';
import * as td from 'testdouble';
import { afterEach, test } from 'vitest';
import { InvalidOperationError } from '../../../../../../lib/lambda/common/application/error/invalid-operation-error.js';
import { RequestParams } from '../../../../../../lib/lambda/common/request/request-params.js';
import {
  CreateHandlerLive,
  CreateHandlerTest,
} from '../../../../../../lib/lambda/products/application/operation/handler/create-handler.js';
import {
  InvalidOperationLive,
  Operation,
  ValidOperationLive,
} from '../../../../../../lib/lambda/products/application/operation/operation.js';
import {
  CreateValidatorLive,
  CreateValidatorTest,
} from '../../../../../../lib/lambda/products/application/operation/validation/create-validator.js';
import { ProbeTest } from '../../../../../../lib/lambda/products/application/probe/probe.js';
import { ProductService } from '../../../../../../lib/lambda/products/application/service/product-service.js';

const params = td.object<RequestParams>();

const program = Effect.gen(function* () {
  const operation = yield* Operation;
  return yield* operation.exec(params);
});

afterEach(() => {
  td.reset();
});

test('executes invalid operations', () => {
  const operation = InvalidOperationLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program, operation);

  const result = Effect.runSyncExit(runnable);

  assert.deepStrictEqual(result, Exit.fail(new InvalidOperationError()));
});

test('executes valid operations', () => {
  const operation = ValidOperationLive.pipe(
    Layer.provide(Layer.merge(CreateValidatorTest, CreateHandlerTest)),
    Layer.provide(ProbeTest)
  );
  const runnable = Effect.provide(program, operation);

  const result = Effect.runSyncExit(runnable);

  assert.deepStrictEqual(result, Exit.void);
});

test('builds an invalid operation layer', () => {
  const params = new RequestParams({ body: 'foo', httpMethod: 'bar' });

  assert.deepStrictEqual(Operation.from(params), InvalidOperationLive);
});

test.skip('builds an valid operation layer', () => {
  const params = new RequestParams({ body: 'foo', httpMethod: 'POST' });
  const layer = ValidOperationLive.pipe(
    Layer.provide(Layer.merge(CreateValidatorLive, CreateHandlerLive)),
    Layer.provide(ProductService.build())
  );

  assert.deepEqual(Operation.from(params), layer);
});
