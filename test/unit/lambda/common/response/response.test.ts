import { expect, test } from 'vitest';
import { Response } from '../../../../../lib/lambda/common/response/response.js';

const requestId = 'foo';
const data = { bar: 'baz' };

test('produces ok response', () => {
  expect(Response.ok(requestId, data)).toStrictEqual({
    statusCode: 200,
    body: JSON.stringify({ requestId, message: 'OK', ...data }),
  });
});

test('produces bad request response', () => {
  expect(Response.badRequest(requestId, data)).toStrictEqual({
    statusCode: 400,
    body: JSON.stringify({ requestId, message: 'Bad Request', ...data }),
  });
});

test('produces not found response', () => {
  expect(Response.notFound(requestId)).toStrictEqual({
    statusCode: 404,
    body: JSON.stringify({ requestId, message: 'Not Found' }),
  });
});

test('produces internal server error response', () => {
  expect(Response.serverError(requestId)).toStrictEqual({
    statusCode: 500,
    body: JSON.stringify({ requestId, message: 'Internal Server Error' }),
  });
});
