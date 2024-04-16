import { formatErrorSync } from '@effect/schema/ArrayFormatter';
import * as S from '@effect/schema/Schema';
import { Effect, Layer, pipe } from 'effect';
import { SafeJson } from '../../../../../vendor/type/safe-json.js';
import { ValidationError } from '../../../../common/application/error/validation-error.js';
import { RequestParams } from '../../../../common/request/request-params.js';
import { ProductEvent } from '../../event/product-event.js';
import { Validator } from './validator.js';

export const CreateValidatorLive = Layer.succeed(Validator, {
  validate: ({ body }: RequestParams) =>
    pipe(
      body,
      SafeJson.parse,
      Effect.orElseSucceed(() => ({})),
      Effect.flatMap((data) =>
        pipe(data, S.decodeUnknown(ProductSchema, { errors: 'all' }))
      ),
      Effect.mapError((error) => new ValidationError(formatErrorSync(error))),
      Effect.map((product) => ({
        event: ProductEvent.CREATE_PRODUCT,
        product,
      }))
    ),
});

export const ProductSchema = S.Struct({
  description: S.String,
  name: S.String,
  price: S.String,
});
