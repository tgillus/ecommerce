import { spec } from 'pactum';
import { describe, test } from 'vitest';

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
