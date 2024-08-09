import { Effect, Exit } from 'effect';
import { NoSuchElementException } from 'effect/Cause';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import {
  ApiGateway,
  ApiGatewayLive,
} from '../../../../lib/infrastructure/api-gateway/api-gateway.js';
import {
  ApiGatewayClient,
  ApiGatewayClientFailureTest,
  ApiGatewayClientSuccessTest,
} from '../../../../lib/vendor/aws/api-gateway/api-gateway-client.js';

const apiName = 'bar';

const program = Effect.gen(function* () {
  const apiGateway = yield* ApiGateway;
  return yield* apiGateway.apiId(apiName);
});

beforeEach(() => {
  td.replace(ApiGatewayClient, 'build');
});

afterEach(() => {
  td.reset();
});

test('builds an api gateway', async () => {
  td.when(ApiGatewayClient.build()).thenReturn(ApiGatewayClientSuccessTest);
  const runnable = program.pipe(Effect.provide(ApiGateway.build()));

  expect(await Effect.runPromise(runnable)).toStrictEqual('foo');
});

test('retrieves an api id', async () => {
  const runnable = program.pipe(
    Effect.provide(ApiGatewayLive),
    Effect.provide(ApiGatewayClientSuccessTest)
  );

  expect(await Effect.runPromise(runnable)).toStrictEqual('foo');
});

test('returns error when no api id found', async () => {
  const runnable = program.pipe(
    Effect.provide(ApiGatewayLive),
    Effect.provide(ApiGatewayClientFailureTest)
  );

  expect(await Effect.runPromiseExit(runnable)).toStrictEqual(
    Exit.fail(
      new NoSuchElementException(
        `api named ${apiName} found but does not have an id`
      )
    )
  );
});
