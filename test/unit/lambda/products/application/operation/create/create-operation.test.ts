import { Effect, Exit, Layer } from 'effect';
import * as td from 'testdouble';
import { afterEach, expect, test } from 'vitest';
import { RequestParams } from '../../../../../../../lib/lambda/common/request/request-params.js';
import {
  CreateOperation,
  CreateOperationTest,
} from '../../../../../../../lib/lambda/products/application/operation/create/create-operation.js';
import { OpFactory } from '../../../../../../../lib/lambda/products/application/operation/op-factory.js';
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

test('builds an valid operation layer', () => {
  td.when(CreateOperation.build()).thenReturn(CreateOperationTest);
  const params = new RequestParams({
    body: 'foo',
    httpMethod: 'POST',
    pathParameters: { productId: 'bar' },
  });
  const operation = OpFactory.from(params).pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program, operation);

  const result = Effect.runSyncExit(runnable);

  expect(result).toStrictEqual(Exit.succeed({ productId: 'foo' }));
});
