import { IdGenerator } from '../../../../vendor/id/id-generator.js';
import { Time } from '../../../../vendor/type/time.js';
import { Product } from '../../domain/model/product.js';

export class ProductMapper {
  map = ({ name, price }: Product) => ({
    PK: `PRODUCT#${IdGenerator.generate()}`,
    SK: `PRODUCT#${Time.now().toISOString()}`,
    Name: name,
    Price: price,
  });
}
