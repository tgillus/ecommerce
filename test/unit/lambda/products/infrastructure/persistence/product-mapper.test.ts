import { Effect } from 'effect';
import { expect, test } from 'vitest';
import { ProductDto } from '../../../../../../lib/lambda/products/domain/dto/product-dto.js';
import {
  ProductMapper,
  ProductMapperLive,
} from '../../../../../../lib/lambda/products/infrastructure/persistence/product-mapper.js';
import { Time } from '../../../../../../lib/vendor/type/time.js';

test('maps products to dynamo item', () => {
  const id = 'foo';
  const description = 'bar';
  const name = 'baz';
  const price = '9.99';
  const createdAt = Time.now();
  const product = new ProductDto(
    {
      description,
      name,
      price,
    },
    id,
    createdAt
  );
  const program = Effect.gen(function* () {
    const productMapper = yield* ProductMapper;
    return productMapper.map(product);
  });
  const runnable = program.pipe(Effect.provide(ProductMapperLive));

  expect(Effect.runSync(runnable)).toEqual({
    PK: `PRODUCT#${id}`,
    SK: `PRODUCT#${createdAt.toISOString()}`,
    CreatedAt: createdAt.toISOString(),
    Description: description,
    Id: id,
    Name: name,
    Price: price,
  });
});
