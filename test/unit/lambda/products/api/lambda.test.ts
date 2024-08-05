import type { APIGatewayEvent } from 'aws-lambda';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { RequestParams } from '../../../../../lib/lambda/common/request/request-params.js';
import { Response } from '../../../../../lib/lambda/common/response/response.js';
import { Api, ApiTest } from '../../../../../lib/lambda/products/api/api.js';
import { handler } from '../../../../../lib/lambda/products/api/lambda.js';

const event = td.object<APIGatewayEvent>();
const params = new RequestParams(event);
const requestId = 'foo';

beforeEach(() => {
  td.replace(Api, 'from');
});

afterEach(() => {
  td.reset();
});

test('returns api result', async () => {
  td.when(Api.from(params)).thenReturn(ApiTest);

  expect(await handler(event)).toStrictEqual(
    Response.ok(requestId, { bar: 'baz' })
  );
});
