import { Effect, Exit, Layer } from 'effect';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { InvalidOperationError } from '../../../../../../lib/lambda/common/application/error/invalid-operation-error.js';
import { RequestParams } from '../../../../../../lib/lambda/common/request/request-params.js';
import {
  CreateOperation,
  CreateOperationTest,
} from '../../../../../../lib/lambda/products/application/operation/create/create-operation.js';
import { OpFactory } from '../../../../../../lib/lambda/products/application/operation/op-factory.js';
import { Operation } from '../../../../../../lib/lambda/products/application/operation/operation.js';
import {
  ReadOperation,
  ReadOperationTest,
} from '../../../../../../lib/lambda/products/application/operation/read/read-operation.js';
import { ProbeTest } from '../../../../../../lib/lambda/products/application/probe/probe.js';

const params = td.object<RequestParams>();

const program = Effect.gen(function* () {
  const operation = yield* Operation;
  return yield* operation.exec(params);
});

beforeEach(() => {
  td.replace(CreateOperation, 'build');
  td.replace(ReadOperation, 'build');
});

afterEach(() => {
  td.reset();
});

test('builds a create operation layer', async () => {
  td.when(CreateOperation.build()).thenReturn(CreateOperationTest);
  const params = new RequestParams({
    body: 'foo',
    httpMethod: 'POST',
    pathParameters: null,
  });
  const operation = OpFactory.from(params).pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program, operation);

  expect(await Effect.runPromise(runnable)).toStrictEqual({ productId: 'foo' });
});

test('builds a read operation layer', async () => {
  td.when(ReadOperation.build()).thenReturn(ReadOperationTest);
  const params = new RequestParams({
    body: null,
    httpMethod: 'GET',
    pathParameters: { productId: 'foo' },
  });
  const operation = OpFactory.from(params).pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program, operation);

  expect(await Effect.runPromise(runnable)).toStrictEqual({ foo: 'bar' });
});

test('builds an invalid operation layer', async () => {
  const params = new RequestParams({
    body: null,
    httpMethod: 'bar',
    pathParameters: null,
  });
  const operation = OpFactory.from(params).pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program, operation);

  expect(await Effect.runPromiseExit(runnable)).toStrictEqual(
    Exit.fail(new InvalidOperationError())
  );
});
