import { expect, test } from 'vitest';
import { RequestParams } from '../../../../../lib/lambda/common/request/request-params.js';

test('provides request body', () => {
  const { body } = new RequestParams({
    body: 'foo',
    httpMethod: 'bar',
    pathParameters: { productId: 'baz' },
  });

  expect(body).toEqual('foo');
});

test('defaults request body to empty string', () => {
  const { body } = new RequestParams({
    body: null,
    httpMethod: 'bar',
    pathParameters: { productId: 'baz' },
  });

  expect(body).toEqual('');
});

test('provides request http method', () => {
  const { httpMethod } = new RequestParams({
    body: 'foo',
    httpMethod: 'BAR',
    pathParameters: { productId: 'baz' },
  });

  expect(httpMethod).toEqual('BAR');
});

test('capitalizes request http method', () => {
  const { httpMethod } = new RequestParams({
    body: 'foo',
    httpMethod: 'bar',
    pathParameters: { productId: 'baz' },
  });

  expect(httpMethod).toEqual('BAR');
});

test('provides path parameters', () => {
  const pathParameters = { productId: 'baz' };
  const { parameters } = new RequestParams({
    body: 'foo',
    httpMethod: 'bar',
    pathParameters,
  });

  expect(parameters).toEqual(pathParameters);
});
