import { APIGatewayEvent } from 'aws-lambda';
import * as td from 'testdouble';
import { expect, test } from 'vitest';
import { handler } from '../../../../lib/lambda/products/product-api/index.js';

test('returns result', async () => {
  const event = td.object<APIGatewayEvent>();

  const result = await handler(event);

  expect(result).toEqual({
    body: JSON.stringify({ message: 'Hello from product-api' }),
    statusCode: 200,
  });
});
