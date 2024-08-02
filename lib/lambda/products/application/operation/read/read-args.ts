import type { ProductEvent } from '../../event/product-event.js';

export interface ReadArgs {
  readonly event: typeof ProductEvent.READ_PRODUCT;
  readonly productId: string;
}
