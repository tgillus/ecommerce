import * as S from '@effect/schema/Schema';
import { Effect, Function, pipe } from 'effect';
import { z } from 'zod';
import { SafeJson } from '../../../../../vendor/type/safe-json.js';
import { RequestParams } from '../../../../common/request/request-params.js';
import { ProductEvent } from '../../event/product-event.js';
import { CreateArgs } from '../args/create-args.js';
import { Validator } from './validator.js';

export class CreateValidator implements Validator {
  validate = ({ body }: RequestParams) =>
    pipe(
      body,
      SafeJson.parse,
      Effect.match({
        onFailure: () => ({}),
        onSuccess: Function.identity,
      }),
      Effect.flatMap((data) =>
        Effect.try<CreateArgs>(() => ({
          event: ProductEvent.CREAT_PRODUCT,
          product: { ...ProductSchema.parse(data) },
        }))
      )
    );
}

const ProductSchema = z.object({
  description: z.string(),
  name: z.string(),
  price: z.string(),
});

const Product = S.struct({
  description: S.string,
  name: S.string,
  price: S.string,
});
interface Product extends S.Schema.Type<typeof Product> {}

const product = {
  description: 'description',
  name: 'name',
  price: 'price',
} satisfies Product;

// eslint-disable-next-line no-console
console.log(product);
