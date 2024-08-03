import { Effect, Layer } from 'effect';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { RequestParams } from '../../../../../../../lib/lambda/common/request/request-params.js';
import { Operation } from '../../../../../../../lib/lambda/products/application/operation/operation.js';
import {
  ReadHandler,
  ReadHandlerTest,
} from '../../../../../../../lib/lambda/products/application/operation/read/read-handler.js';
import {
  ReadOperation,
  ReadOperationLive,
} from '../../../../../../../lib/lambda/products/application/operation/read/read-operation.js';
import {
  ReadValidator,
  ReadValidatorTest,
} from '../../../../../../../lib/lambda/products/application/operation/read/read-validator.js';
import { ProbeTest } from '../../../../../../../lib/lambda/products/application/probe/probe.js';

const program = (params: RequestParams) =>
  Effect.gen(function* () {
    const operation = yield* Operation;
    return yield* operation.exec(params);
  });

beforeEach(() => {
  td.replace(ReadHandler, 'build');
  td.replace(ReadValidator, 'build');
});

afterEach(() => {
  td.reset();
});

test('builds a read operation', async () => {
  td.when(ReadHandler.build()).thenReturn(ReadHandlerTest);
  td.when(ReadValidator.build()).thenReturn(ReadValidatorTest);
  const params = new RequestParams({
    body: 'foo',
    httpMethod: 'POST',
    pathParameters: null,
  });
  const operation = ReadOperation.build();
  const runnable = program(params).pipe(
    Effect.provide(operation),
    Effect.provide(ProbeTest)
  );

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    item: {
      description: 'foo',
      id: 'baz',
      name: 'bar',
      price: '9.99',
    },
  });
});

test('executes read operations', async () => {
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
  const runnable = Effect.provide(program(params), operation);

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    item: {
      description: 'foo',
      id: 'baz',
      name: 'bar',
      price: '9.99',
    },
  });
});
