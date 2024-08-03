import { formatErrorSync } from '@effect/schema/ArrayFormatter';
import * as S from '@effect/schema/Schema';
import { Context, Effect, Layer, pipe } from 'effect';
import { SafeJson } from '../../../../../vendor/type/safe-json.js';
import { ValidationError } from '../../../../common/application/error/validation-error.js';
import type { RequestParams } from '../../../../common/request/request-params.js';
import { ProductEvent } from '../../event/product-event.js';
import { Probe } from '../../probe/probe.js';
import type { Validator } from '../operation.js';

export class CreateValidator extends Context.Tag('CreateValidator')<
  CreateValidator,
  Validator
>() {}

export const CreateValidatorLive = Layer.effect(
  CreateValidator,
  Effect.gen(function* () {
    const probe = yield* Probe;

    return {
      validate: ({ body }: RequestParams) =>
        SafeJson.parse(body).pipe(
          Effect.orElseSucceed(() => ({})),
          Effect.andThen((data) =>
            pipe(
              data,
              S.decodeUnknown(CreateProductArgsSchema, { errors: 'all' })
            )
          ),
          Effect.mapError(
            (error) => new ValidationError(formatErrorSync(error))
          ),
          Effect.tapBoth({
            onFailure: probe.argsValidationFailed,
            onSuccess: probe.argsValidationSucceeded,
          }),
          Effect.andThen((product) => ({
            event: ProductEvent.CREATE_PRODUCT,
            product,
          }))
        ),
    };
  })
);

const CreateProductArgsSchema = S.Struct({
  description: S.String,
  name: S.String,
  price: S.String,
});
