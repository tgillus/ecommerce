import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import type { Product } from '../../lib/lambda/products/domain/model/product.js';

type FactoryProduct = {
  [P in keyof Product]: Product[P] | undefined;
};

export const productFactory = Factory.define<FactoryProduct>(() => ({
  description: faker.commerce.productDescription(),
  name: faker.commerce.productName(),
  price: faker.commerce.price({
    dec: 2,
    max: 99999.99,
  }),
}));
