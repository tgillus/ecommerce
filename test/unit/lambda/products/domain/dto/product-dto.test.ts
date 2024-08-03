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
  expect(productDto.toJSON()).toEqual({
    id,
    description,
    name,
    price,
  });
});

test('returns product id', () => {
  expect(productDto.id).toEqual(id);
});

test('returns product description', () => {
  expect(productDto.description).toEqual(description);
});

test('returns product name', () => {
  expect(productDto.name).toEqual(name);
});

test('returns product price', () => {
  expect(productDto.price).toEqual(price);
});

test('returns date product was created', () => {
  expect(productDto.createdAt).toEqual(now);
});
