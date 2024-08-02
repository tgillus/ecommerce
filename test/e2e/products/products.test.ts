import { faker } from '@faker-js/faker';
import { request, spec } from 'pactum';
import { describe, inject, test } from 'vitest';

const accessToken = inject('accessToken');
const apiBaseUrl = inject('apiBaseUrl');

request.setBaseUrl(apiBaseUrl);

describe('POST /products', () => {
  test('saves new products', async () => {
    await spec()
      .post('/products')
      .withHeaders('Authorization', accessToken)
      .withBody({
        description: faker.commerce.productDescription(),
        name: faker.commerce.productName(),
        price: faker.commerce.price({
          dec: 2,
        }),
      })
      .expectStatus(200)
      .returns('id');
  });

  test('requires an access token', async () => {
    await spec()
      .post('/products')
      .withPathParams('productId', 'foo')
      .expectStatus(401);
  });
});

describe('GET /products/{productId}', () => {
  test('retrieves an existing product', async () => {
    const productId = await spec()
      .post('/products')
      .withHeaders('Authorization', accessToken)
      .withBody({
        description: faker.commerce.productDescription(),
        name: faker.commerce.productName(),
        price: faker.commerce.price({
          dec: 2,
        }),
      })
      .expectStatus(200)
      .returns('id');

    await spec()
      .get('/products/{productId}')
      .withPathParams('productId', productId)
      .withHeaders('Authorization', accessToken)
      .expectStatus(200);
  });

  test('returns 404 when products are not found', async () => {
    await spec()
      .get('/products/{productId}')
      .withPathParams('productId', 'foo')
      .withHeaders('Authorization', accessToken)
      .expectStatus(404);
  });

  test('requires an access token', async () => {
    await spec()
      .get('/products/{productId}')
      .withPathParams('productId', 'foo')
      .expectStatus(401);
  });
});
