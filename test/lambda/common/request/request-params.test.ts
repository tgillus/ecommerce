import { expect, test } from 'vitest';
import { RequestParams } from '../../../../lib/lambda/common/request/request-params.js';

test('provides request body', () => {
  const { body } = new RequestParams({ body: 'foo', httpMethod: 'bar' });

  expect(body).toEqual('foo');
});

test('defaults request body to empty string', () => {
  const { body } = new RequestParams({ body: null, httpMethod: 'bar' });

  expect(body).toEqual('');
});

test('provides request http method', () => {
  const { httpMethod } = new RequestParams({ body: 'foo', httpMethod: 'bar' });

  expect(httpMethod).toEqual('bar');
});
