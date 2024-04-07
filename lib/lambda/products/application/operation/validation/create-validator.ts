import { Effect } from 'effect';
import { z } from 'zod';
import { ProductEvent } from '../../event/product-event.js';
import { CreateArgs } from '../args/create-args.js';
import { Validator } from './validator.js';

export class CreateValidator implements Validator {
  validate = (data: unknown) =>
    Effect.try<CreateArgs>(() => ({
      event: ProductEvent.CREAT_PRODUCT,
      product: { ...ProductSchema.parse(data) },
    }));
}

const ProductSchema = z.object({
  name: z.string(),
  price: z.string(),
});
