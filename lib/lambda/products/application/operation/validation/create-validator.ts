import { Context, Effect, Function, Layer, pipe } from 'effect';
import { UnknownException } from 'effect/Cause';
import { z } from 'zod';
import { SafeJson } from '../../../../../vendor/type/safe-json.js';
import { RequestParams } from '../../../../common/request/request-params.js';
import { ProductEvent } from '../../event/product-event.js';
import { CreateArgs } from '../args/create-args.js';

export class CreateValidator extends Context.Tag('CreateValidator')<
  CreateValidator,
  {
    validate: (
      params: RequestParams
    ) => Effect.Effect<CreateArgs, UnknownException>;
  }
>() {}

export const CreateValidatorLive = Layer.succeed(
  CreateValidator,
  CreateValidator.of({
    validate: ({ body }: RequestParams) =>
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
      ),
  })
);

const ProductSchema = z.object({
  description: z.string(),
  name: z.string(),
  price: z.string(),
});
