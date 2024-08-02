import type { Product } from '../../../domain/model/product.js';
import type { ProductEvent } from '../../event/product-event.js';

export interface CreateArgs {
  readonly event: typeof ProductEvent.CREATE_PRODUCT;
  readonly product: Product;
}
