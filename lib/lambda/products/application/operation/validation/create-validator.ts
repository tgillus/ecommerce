import { formatErrorSync } from '@effect/schema/ArrayFormatter';
import * as S from '@effect/schema/Schema';
import { Effect, Layer, pipe } from 'effect';
import { SafeJson } from '../../../../../vendor/type/safe-json.js';
import { ValidationError } from '../../../../common/application/error/validation-error.js';
import { RequestParams } from '../../../../common/request/request-params.js';
import { ProductEvent } from '../../event/product-event.js';
import { Probe } from '../../probe/probe.js';
import { Validator } from './validator.js';

export const CreateValidatorLive = Layer.effect(
  Validator,
  Effect.gen(function* (_) {
    const probe = yield* _(Probe);

    return {
      validate: ({ body }: RequestParams) =>
        SafeJson.parse(body).pipe(
          Effect.orElseSucceed(() => ({})),
          Effect.flatMap((data) =>
            pipe(data, S.decodeUnknown(ProductSchema, { errors: 'all' }))
          ),
          Effect.mapError(
            (error) => new ValidationError(formatErrorSync(error))
          ),
          Effect.tapBoth({
            onFailure: probe.argsValidationFailed,
            onSuccess: probe.argsValidationSucceeded,
          }),
          Effect.map((product) => ({
            event: ProductEvent.CREATE_PRODUCT,
            product,
          }))
        ),
    };
  })
);

export const ProductSchema = S.Struct({
  description: S.String,
  name: S.String,
  price: S.String,
});
