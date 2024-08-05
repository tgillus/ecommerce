import { Effect, Exit } from 'effect';
import { NoSuchElementException } from 'effect/Cause';
import * as td from 'testdouble';
import { expect, test } from 'vitest';
import { ApiGateway } from '../../../../lib/infrastructure/api-gateway/api-gateway.js';
import type { Client } from '../../../../lib/vendor/aws/api-gateway/client.js';

const apiName = 'foo';
const client = td.object<Client>();
const apiGateway = new ApiGateway(client);

test('retrieves an api id', async () => {
  const id = 'bar';
  td.when(client.restApi(apiName)).thenReturn(
    Effect.succeed({
      id,
    })
  );

  expect(await Effect.runPromise(apiGateway.apiId(apiName))).toStrictEqual(id);
});

test('returns error when no api id found', async () => {
  td.when(client.restApi(apiName)).thenReturn(Effect.succeed({}));

  expect(await Effect.runPromiseExit(apiGateway.apiId(apiName))).toStrictEqual(
    Exit.fail(
      new NoSuchElementException(
        `api named ${apiName} found but does not have an id`
      )
    )
  );
});

test('builds an api gateway', () => {
  expect(ApiGateway.build()).toBeInstanceOf(ApiGateway);
});
