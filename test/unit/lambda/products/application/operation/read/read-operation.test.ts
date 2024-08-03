import { Effect, Layer } from 'effect';
import * as td from 'testdouble';
import { afterEach, expect, test } from 'vitest';
import { RequestParams } from '../../../../../../../lib/lambda/common/request/request-params.js';
import { CreateOperation } from '../../../../../../../lib/lambda/products/application/operation/create/create-operation.js';
import { Operation } from '../../../../../../../lib/lambda/products/application/operation/operation.js';
import { ReadHandlerTest } from '../../../../../../../lib/lambda/products/application/operation/read/read-handler.js';
import { ReadOperationLive } from '../../../../../../../lib/lambda/products/application/operation/read/read-operation.js';
import { ReadValidatorTest } from '../../../../../../../lib/lambda/products/application/operation/read/read-validator.js';
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

test('handles read operations', async () => {
  const params = new RequestParams({
    body: null,
    httpMethod: 'GET',
    pathParameters: { productId: 'foo' },
  });
  const operation = ReadOperationLive.pipe(
    Layer.provide(ReadHandlerTest),
    Layer.provide(ReadValidatorTest),
    Layer.provide(ProbeTest)
  );
  const runnable = Effect.provide(program, operation);

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    item: {
      description: 'foo',
      id: 'baz',
      name: 'bar',
      price: '9.99',
    },
  });
});
