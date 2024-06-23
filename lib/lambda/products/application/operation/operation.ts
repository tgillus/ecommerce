import { Context, Effect, Layer, Match, Option, identity } from 'effect';
import { InvalidOperationError } from '../../../common/application/error/invalid-operation-error.js';
import type { ServiceError } from '../../../common/application/error/service-error.js';
import type { ValidationError } from '../../../common/application/error/validation-error.js';
import type { RequestParams } from '../../../common/request/request-params.js';
import { Probe } from '../probe/probe.js';
import { ProductService } from '../service/product-service.js';
import { CreateHandlerLive } from './handler/create-handler.js';
import { Handler } from './handler/handler.js';
import { CreateValidatorLive } from './validation/create-validator.js';
import { Validator } from './validation/validator.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Operation extends Context.Tag('Operation')<
  Operation,
  {
    exec: (
      params: RequestParams
    ) => Effect.Effect<
      void,
      InvalidOperationError | ServiceError | ValidationError
    >;
  }
>() {
  static from = ({ httpMethod }: RequestParams) =>
    Match.value(httpMethod).pipe(
      Match.when('POST', () =>
        ValidOperationLive.pipe(
          Layer.provide(Layer.merge(CreateValidatorLive, CreateHandlerLive)),
          Layer.provide(ProductService.build())
        )
      ),
      Match.option,
      Option.match({
        onNone: () => InvalidOperationLive,
        onSome: identity,
      })
    );
}

export const InvalidOperationLive = Layer.effect(
  Operation,
  Effect.gen(function* () {
    const probe = yield* Probe;

    return {
      exec: () =>
        probe
          .invalidRequestReceived()
          .pipe(Effect.andThen(() => Effect.fail(new InvalidOperationError()))),
    };
  })
);

export const ValidOperationLive = Layer.effect(
  Operation,
  Effect.gen(function* () {
    const validator = yield* Validator;
    const handler = yield* Handler;
    const probe = yield* Probe;

    return {
      exec: (params: RequestParams) =>
        probe.validRequestReceived().pipe(
          Effect.andThen(() => validator.validate(params)),
          Effect.andThen(handler.exec)
        ),
    };
  })
);
