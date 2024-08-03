import { Effect, Layer } from 'effect';
import { expect, test } from 'vitest';
import { RequestParams } from '../../../../../../../lib/lambda/common/request/request-params.js';
import { CreateHandlerTest } from '../../../../../../../lib/lambda/products/application/operation/create/create-handler.js';
import { CreateOperationLive } from '../../../../../../../lib/lambda/products/application/operation/create/create-operation.js';
import { CreateValidatorTest } from '../../../../../../../lib/lambda/products/application/operation/create/create-validator.js';
import { Operation } from '../../../../../../../lib/lambda/products/application/operation/operation.js';
import { ProbeTest } from '../../../../../../../lib/lambda/products/application/probe/probe.js';

const program = (params: RequestParams) =>
  Effect.gen(function* () {
    const operation = yield* Operation;
    return yield* operation.exec(params);
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
