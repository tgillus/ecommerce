import { Effect, Layer } from 'effect';
import * as td from 'testdouble';
import { afterEach, expect, test } from 'vitest';
import { RequestParams } from '../../../../../../../lib/lambda/common/request/request-params.js';
import { CreateHandlerTest } from '../../../../../../../lib/lambda/products/application/operation/create/create-handler.js';
import {
  CreateOperation,
  CreateOperationLive,
} from '../../../../../../../lib/lambda/products/application/operation/create/create-operation.js';
import { CreateValidatorTest } from '../../../../../../../lib/lambda/products/application/operation/create/create-validator.js';
import { Operation } from '../../../../../../../lib/lambda/products/application/operation/operation.js';
import { ProbeTest } from '../../../../../../../lib/lambda/products/application/probe/probe.js';

td.replace(CreateOperation, 'build');

const params = td.object<RequestParams>();

const program = Effect.gen(function* () {
  const operation = yield* Operation;
  return yield* operation.exec(params);
});

afterEach(() => {
  td.reset();
});

test('handles create operations', async () => {
  const params = new RequestParams({
    body: 'foo',
    httpMethod: 'POST',
    pathParameters: { productId: 'bar' },
  });
  const operation = CreateOperationLive.pipe(
    Layer.provide(CreateHandlerTest),
    Layer.provide(CreateValidatorTest),
    Layer.provide(ProbeTest)
  );
  const runnable = Effect.provide(program, operation);

  expect(await Effect.runPromise(runnable)).toStrictEqual({ id: 'foo' });
});
