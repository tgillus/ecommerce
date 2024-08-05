import { expect, test } from 'vitest';
import { RequestParams } from '../../../../../lib/lambda/common/request/request-params.js';

test('provides request body', () => {
  const body = 'foo';
  const params = new RequestParams({
    body,
    httpMethod: 'bar',
    pathParameters: { productId: 'baz' },
  });

  expect(params.body).toStrictEqual(body);
});

test('defaults request body to empty string', () => {
  const { body } = new RequestParams({
    body: null,
    httpMethod: 'bar',
    pathParameters: { productId: 'baz' },
  });

  expect(body).toStrictEqual('');
});

test('provides request http method', () => {
  const httpMethod = 'BAR';
  const params = new RequestParams({
    body: 'foo',
    httpMethod: 'BAR',
    pathParameters: { productId: 'baz' },
  });

  expect(params.httpMethod).toStrictEqual(httpMethod);
});

test('capitalizes request http method', () => {
  const httpMethod = 'bar';
  const params = new RequestParams({
    body: 'foo',
    httpMethod,
    pathParameters: { productId: 'baz' },
  });

  expect(params.httpMethod).toStrictEqual(httpMethod.toUpperCase());
});

test('provides path parameters', () => {
  const pathParameters = { productId: 'baz' };
  const { parameters } = new RequestParams({
    body: 'foo',
    httpMethod: 'bar',
    pathParameters,
  });

  expect(parameters).toStrictEqual(pathParameters);
});
