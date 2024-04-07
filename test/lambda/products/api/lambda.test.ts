import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as td from 'testdouble';
import { beforeAll, expect, test } from 'vitest';
import { RequestParams } from '../../../../lib/lambda/common/request/request-params.js';
import { Api } from '../../../../lib/lambda/products/api/api.js';
import { handler } from '../../../../lib/lambda/products/api/lambda.js';

beforeAll(() => {
  td.replace(Api, 'from');
});

test('returns result', async () => {
  const api = td.object<Api>();
  const event = td.object<APIGatewayEvent>();
  const result = {
    body: 'foo',
    statusCode: 200,
  } satisfies APIGatewayProxyResult;
  const params = new RequestParams(event);
  td.when(Api.from(params)).thenReturn(api);
  td.when(api.handler(params)).thenResolve(result);

  expect(await handler(event)).toEqual(result);
});
