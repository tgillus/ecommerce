import { request, spec } from 'pactum';
import { describe, test } from 'vitest';

request.setBaseUrl(
  `https://${process.env.AWS_API_GATEWAY_ID}.execute-api.${process.env.AWS_API_GATEWAY_REGION}.amazonaws.com/prod`
);

describe('POST /products', () => {
  test('saves new products', async () => {
    await spec()
      .post('/products')
      .withBody({
        name: 'foo',
        price: 'bar',
      })
      .expectStatus(200);
  });
});
