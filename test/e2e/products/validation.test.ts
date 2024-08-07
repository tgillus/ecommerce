import { spec } from 'pactum';
import { describe, test } from 'vitest';
import { productFactory } from '../../factories/product-factory.js';
import { accessToken, requestId } from '../fixture.js';

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
