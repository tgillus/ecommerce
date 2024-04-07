import { Product } from '../../../domain/model/product.js';
import { ProductEvent } from '../../event/product-event.js';

export interface CreateArgs {
  readonly event: ProductEvent;
  readonly product: Product;
}
