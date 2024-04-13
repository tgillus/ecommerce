import { APIGatewayEvent } from 'aws-lambda';
import { Effect, Layer } from 'effect';
import { constVoid } from 'effect/Function';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { RequestParams } from '../../../../../lib/lambda/common/request/request-params.js';
import { Response } from '../../../../../lib/lambda/common/response/response.js';
import { Api } from '../../../../../lib/lambda/products/api/api.js';
import { handler } from '../../../../../lib/lambda/products/api/lambda.js';

const event = td.object<APIGatewayEvent>();
const params = new RequestParams(event);

const successEffect = Effect.succeed(constVoid);
const failureEffect = Effect.fail(new Error('foo'));

const layer = (effect: typeof successEffect | typeof failureEffect) =>
  Layer.succeed(
    Api,
    Api.of({
      handler: () => effect,
    })
  );

beforeEach(() => {
  td.replace(Api, 'from');
});

afterEach(() => {
  td.reset();
});

test('returns success results', async () => {
  td.when(Api.from(params)).thenReturn(layer(successEffect));

  expect(await handler(event)).toEqual(Response.success());
});

test('returns failure results', async () => {
  td.when(Api.from(params)).thenReturn(layer(failureEffect));

  expect(await handler(event)).toEqual(Response.fail());
});
