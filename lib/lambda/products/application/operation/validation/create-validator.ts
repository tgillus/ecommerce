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
  name: z.string(),
  price: z.string(),
});
