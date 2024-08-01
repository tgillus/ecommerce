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
      .expectStatus(200);
  });
});

describe.skip('GET /products/{id}', () => {
  test('retrieves existing product', async () => {
    const response = await spec()
      .get('/products/{id}')
      .withPathParams('id', 'eQLgCGvLVB6O_fTTsDyQP')
      .withHeaders('Authorization', accessToken)
      .expectStatus(200);
  });
});
