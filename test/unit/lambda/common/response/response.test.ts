import { expect, test } from 'vitest';
import { Response } from '../../../../../lib/lambda/common/response/response.js';

const requestId = 'foo';
const data = { bar: 'baz' };

test('produces ok response', () => {
  expect(Response.ok(requestId, data)).toEqual({
    statusCode: 200,
    body: JSON.stringify({ requestId, message: 'OK', ...data }),
  });
});

test('produces bad request response', () => {
  expect(Response.badRequest(requestId, data)).toEqual({
    statusCode: 400,
    body: JSON.stringify({ requestId, message: 'Bad Request', ...data }),
  });
});

test('produces not found response', () => {
  expect(Response.notFound(requestId)).toEqual({
    statusCode: 404,
    body: JSON.stringify({ requestId, message: 'Not Found' }),
  });
});

test('produces internal server error response', () => {
  expect(Response.serverError(requestId)).toEqual({
    statusCode: 500,
    body: JSON.stringify({ requestId, message: 'Internal Server Error' }),
  });
});
