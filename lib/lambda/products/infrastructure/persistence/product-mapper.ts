import { Context, Layer } from 'effect';
import type { ProductDto } from '../../domain/dto/product-dto.js';

export class ProductMapper extends Context.Tag('ProductMapper')<
  ProductMapper,
  {
    map(product: ProductDto): Record<string, string>;
  }
>() {}

export const ProductMapperLive = Layer.succeed(ProductMapper, {
  map: ({ createdAt, description, id, name, price }) => ({
    PK: `PRODUCT#${id}`,
    SK: `PRODUCT#${createdAt.toISOString()}`,
    CreatedAt: createdAt.toISOString(),
    Description: description,
    Id: id,
    Name: name,
    Price: price,
  }),
});
