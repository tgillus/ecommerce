import { faker } from '@faker-js/faker';
import { request, spec } from 'pactum';
import { describe, inject, test } from 'vitest';

request.setBaseUrl(
  `https://${process.env.AWS_API_GATEWAY_ID}.execute-api.${process.env.AWS_API_GATEWAY_REGION}.amazonaws.com/prod`
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const accessToken = inject('accessToken');

describe('POST /products', () => {
  test('saves new products', async () => {
    await spec()
      .post('/products')
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
