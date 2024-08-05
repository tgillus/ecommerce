import { spec } from 'pactum';
import { describe, inject, test } from 'vitest';
import { productFactory } from '../../factories/product-factory.js';

const accessToken = inject('accessToken');
// const apiBaseUrl = inject('apiBaseUrl');

// request.setBaseUrl(apiBaseUrl);
// request.setDefaultTimeout(10000);

const requestId = /^[A-Za-z0-9_-]+$/;
const id = requestId;

describe('POST /products', () => {
  test('saves new products', async () => {
    const product = productFactory.build();

    await spec()
      .post('/products')
      .withHeaders('Authorization', accessToken)
      .withBody(product)
      .expectStatus(200);
  });
});

describe('GET /products/{productId}', () => {
  test('retrieves an existing product', async () => {
    const product = productFactory.build();

    const productId = await spec()
      .post('/products')
      .withHeaders('Authorization', accessToken)
      .withBody(product)
      .expectStatus(200)
      .expectJsonLike({
        requestId,
        message: 'OK',
        id,
      })
      .returns('id');

    await spec()
      .get('/products/{productId}')
      .withPathParams('productId', productId)
      .withHeaders('Authorization', accessToken)
      .expectStatus(200)
      .expectJsonLike({
        requestId,
        message: 'OK',
        item: {
          ...product,
          id: productId,
        },
      });
  });
});
