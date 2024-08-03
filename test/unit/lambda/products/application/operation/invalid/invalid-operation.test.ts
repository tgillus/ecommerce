import { Effect, Exit, Layer } from 'effect';
import { expect, test } from 'vitest';
import { InvalidOperationError } from '../../../../../../../lib/lambda/common/application/error/invalid-operation-error.js';
import { RequestParams } from '../../../../../../../lib/lambda/common/request/request-params.js';
import { InvalidOperationLive } from '../../../../../../../lib/lambda/products/application/operation/invalid/invalid-operation.js';
import { Operation } from '../../../../../../../lib/lambda/products/application/operation/operation.js';
import { ProbeTest } from '../../../../../../../lib/lambda/products/application/probe/probe.js';

const program = (params: RequestParams) =>
  Effect.gen(function* () {
    const operation = yield* Operation;
    return yield* operation.exec(params);
  });

test('executes invalid operations', async () => {
  const params = new RequestParams({
    body: null,
    httpMethod: 'foo',
    pathParameters: null,
  });
  const operation = InvalidOperationLive.pipe(Layer.provide(ProbeTest));
  const runnable = Effect.provide(program(params), operation);

  expect(await Effect.runPromiseExit(runnable)).toStrictEqual(
    Exit.fail(new InvalidOperationError())
  );
});
