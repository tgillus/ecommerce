import type { Product } from '../../../domain/model/product.js';
import type { ProductEvent } from '../../event/product-event.js';

export interface CreateArgs {
  readonly event: ProductEvent;
  readonly product: Product;
}
