import { spec } from 'pactum';
import { describe, test } from 'vitest';
import { productFactory } from '../../factories/product-factory.js';
import { accessToken, id, requestId } from '../fixture.js';

describe('POST /products', () => {
  test('saves new products', async () => {
    const product = productFactory.build();

    await spec()
      .post('/products')
      .withHeaders('Authorization', accessToken)
      .withBody(product)
      .expectStatus(200)
      .expectJsonLike({
        requestId,
        message: 'OK',
        id,
      });
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
