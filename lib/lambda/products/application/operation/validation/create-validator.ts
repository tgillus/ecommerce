import { Issue, formatError } from '@effect/schema/ArrayFormatter';
import * as S from '@effect/schema/Schema';
import { Context, Effect, Function, Layer, pipe } from 'effect';
import { SafeJson } from '../../../../../vendor/type/safe-json.js';
import { RequestParams } from '../../../../common/request/request-params.js';
import { ProductEvent } from '../../event/product-event.js';
import { CreateArgs } from '../args/create-args.js';

export class CreateValidator extends Context.Tag('CreateValidator')<
  CreateValidator,
  {
    validate: (params: RequestParams) => Effect.Effect<CreateArgs, Issue[]>;
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
          pipe(data, S.decodeUnknown(ProductSchema, { errors: 'all' }))
        ),
        Effect.mapError(formatError),
        Effect.map((product) => ({
          event: ProductEvent.CREATE_PRODUCT,
          product,
        }))
      ),
  })
);

export const ProductSchema = S.struct({
  description: S.string,
  name: S.string,
  price: S.string,
});
