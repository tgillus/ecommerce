import { faker } from '@faker-js/faker';
import { request, spec } from 'pactum';
import { describe, inject, test } from 'vitest';

request.setBaseUrl(
  `https://${process.env.AWS_API_GATEWAY_ID}.execute-api.${process.env.AWS_API_GATEWAY_REGION}.amazonaws.com/prod`
);

const accessToken = inject('accessToken');

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
