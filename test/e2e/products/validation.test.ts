import { request, spec } from 'pactum';
import { describe, inject, test } from 'vitest';
import { productFactory } from '../../factories/product-factory.js';

const accessToken = inject('accessToken');
const apiBaseUrl = inject('apiBaseUrl');

request.setBaseUrl(apiBaseUrl);
request.setDefaultTimeout(10000);

const requestId = /^[A-Za-z0-9_-]+$/;

describe('POST /products', () => {
  test('requires an access token', async () => {
    const product = productFactory.build();

    await spec()
      .post('/products')
      .withBody(product)
      .expectStatus(401)
      .expectJson({
        message: 'Unauthorized',
      });
  });
});

describe('GET /products/{productId}', () => {
  test('returns 404 when products are not found', async () => {
    await spec()
      .get('/products/{productId}')
      .withPathParams('productId', 'foo')
      .withHeaders('Authorization', accessToken)
      .expectStatus(404)
      .expectJsonLike({
        requestId,
        message: 'Not Found',
      });
  });

  test('requires an access token', async () => {
    await spec()
      .get('/products/{productId}')
      .withPathParams('productId', 'foo')
      .expectStatus(401)
      .expectJson({
        message: 'Unauthorized',
      });
  });
});
