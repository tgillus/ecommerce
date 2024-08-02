import type { Product } from '../model/product.js';

export class ProductDto {
  constructor(
    private readonly product: Product,
    public readonly id: string,
    public readonly createdAt: Date
  ) {}

  get description() {
    return this.product.description;
  }

  get name() {
    return this.product.name;
  }

  get price() {
    return this.product.price;
  }

  toJSON() {
    return {
      description: this.description,
      id: this.id,
      name: this.name,
      price: this.price,
    };
  }
}
