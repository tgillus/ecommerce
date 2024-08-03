import { expect, test } from 'vitest';
import { Response } from '../../../../../lib/lambda/common/response/response.js';

const data = { foo: 'bar' };

test('produces ok response', () => {
  expect(Response.ok(data)).toEqual({
    statusCode: 200,
    body: JSON.stringify({ message: 'OK', ...data }),
  });
});

test('produces bad request response', () => {
  expect(Response.badRequest(data)).toEqual({
    statusCode: 400,
    body: JSON.stringify({ message: 'Bad Request', ...data }),
  });
});

test('produces not found response', () => {
  expect(Response.notFound()).toEqual({
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' }),
  });
});

test('produces internal server error response', () => {
  expect(Response.serverError()).toEqual({
    statusCode: 500,
    body: JSON.stringify({ message: 'Internal Server Error' }),
  });
});
