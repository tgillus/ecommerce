import { Effect, Layer } from 'effect';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { RequestParams } from '../../../../../../../lib/lambda/common/request/request-params.js';
import {
  CreateHandler,
  CreateHandlerTest,
} from '../../../../../../../lib/lambda/products/application/operation/create/create-handler.js';
import {
  CreateOperation,
  CreateOperationLive,
} from '../../../../../../../lib/lambda/products/application/operation/create/create-operation.js';
import {
  CreateValidator,
  CreateValidatorTest,
} from '../../../../../../../lib/lambda/products/application/operation/create/create-validator.js';
import { Operation } from '../../../../../../../lib/lambda/products/application/operation/operation.js';
import { ProbeTest } from '../../../../../../../lib/lambda/products/application/probe/probe.js';

const program = (params: RequestParams) =>
  Effect.gen(function* () {
    const operation = yield* Operation;
    return yield* operation.exec(params);
  });

beforeEach(() => {
  td.replace(CreateHandler, 'build');
  td.replace(CreateValidator, 'build');
});

afterEach(() => {
  td.reset();
});

test('builds a create operation', async () => {
  td.when(CreateHandler.build()).thenReturn(CreateHandlerTest);
  td.when(CreateValidator.build()).thenReturn(CreateValidatorTest);
  const params = new RequestParams({
    body: 'foo',
    httpMethod: 'POST',
    pathParameters: null,
  });
  const operation = CreateOperation.build();
  const runnable = program(params).pipe(
    Effect.provide(operation),
    Effect.provide(ProbeTest)
  );

  expect(await Effect.runPromise(runnable)).toStrictEqual({ id: 'foo' });
});

test('executes create operations', async () => {
  const params = new RequestParams({
    body: 'foo',
    httpMethod: 'POST',
    pathParameters: null,
  });
  const operation = CreateOperationLive.pipe(
    Layer.provide(CreateHandlerTest),
    Layer.provide(CreateValidatorTest),
    Layer.provide(ProbeTest)
  );
  const runnable = Effect.provide(program(params), operation);

  expect(await Effect.runPromise(runnable)).toStrictEqual({ id: 'foo' });
});
