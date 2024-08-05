import { expect, test } from 'vitest';
import { ProductDto } from '../../../../../../lib/lambda/products/domain/dto/product-dto.js';
import type { Product } from '../../../../../../lib/lambda/products/domain/model/product.js';

const id = 'foo';
const description = 'bar';
const name = 'baz';
const price = '9.99';
const now = new Date();
const product = {
  description,
  name,
  price,
} satisfies Product;
const productDto = new ProductDto(product, id, now);

test('formats product as json', () => {
  expect(productDto.toJSON()).toStrictEqual({
    id,
    description,
    name,
    price,
  });
});

test('returns product id', () => {
  expect(productDto.id).toStrictEqual(id);
});

test('returns product description', () => {
  expect(productDto.description).toStrictEqual(description);
});

test('returns product name', () => {
  expect(productDto.name).toStrictEqual(name);
});

test('returns product price', () => {
  expect(productDto.price).toStrictEqual(price);
});

test('returns date product was created', () => {
  expect(productDto.createdAt).toStrictEqual(now);
});
