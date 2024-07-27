import { Effect, Exit, Layer } from 'effect';
import * as td from 'testdouble';
import { afterEach, expect, test } from 'vitest';
import { InvalidOperationError } from '../../../../../../../lib/lambda/common/application/error/invalid-operation-error.js';
import { RequestParams } from '../../../../../../../lib/lambda/common/request/request-params.js';
import { OpFactory } from '../../../../../../../lib/lambda/products/application/operation/op-factory.js';
import { Operation } from '../../../../../../../lib/lambda/products/application/operation/operation.js';
import { ProbeTest } from '../../../../../../../lib/lambda/products/application/probe/probe.js';

const params = td.object<RequestParams>();

const program = Effect.gen(function* () {
  const operation = yield* Operation;
  return yield* operation.exec(params);
});

afterEach(() => {
  td.reset();
});

test('builds an invalid operation layer', () => {
  const params = new RequestParams({ body: 'foo', httpMethod: 'bar' });
  const operation = OpFactory.from(params).pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program, operation);

  const result = Effect.runSyncExit(runnable);

  expect(result).toStrictEqual(Exit.fail(new InvalidOperationError()));
});
