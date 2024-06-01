import { Context, Effect, Layer, Match, Option } from 'effect';
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
          Layer.provide(Layer.merge(CreateValidatorLive, CreateHandlerLive))
        )
      ),
      Match.option,
      Option.match({
        onNone: () => InvalidOperationLive,
        onSome: (operation) =>
          operation.pipe(Layer.provide(ProductService.build())),
      })
    );
}

export const InvalidOperationLive = Layer.effect(
  Operation,
  Effect.gen(function* (_) {
    const probe = yield* _(Probe);

    return {
      exec: () =>
        probe
          .invalidRequestReceived()
          .pipe(Effect.flatMap(() => Effect.fail(new InvalidOperationError()))),
    };
  })
);

export const ValidOperationLive = Layer.effect(
  Operation,
  Effect.gen(function* (_) {
    const validator = yield* _(Validator);
    const handler = yield* _(Handler);
    const probe = yield* _(Probe);

    return {
      exec: (params: RequestParams) =>
        probe.validRequestReceived().pipe(
          Effect.flatMap(() => validator.validate(params)),
          Effect.flatMap(handler.exec)
        ),
    };
  })
);
