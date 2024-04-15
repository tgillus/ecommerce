import { Context, Effect, Layer, Match, Option, pipe } from 'effect';
import { InvalidOperationError } from '../../../common/application/error/invalid-operation-error.js';
import { ServiceError } from '../../../common/application/error/service-error.js';
import { ValidationError } from '../../../common/application/error/validation-error.js';
import { RequestParams } from '../../../common/request/request-params.js';
import { DynamoClientLive } from '../../../common/vendor/dynamo/dynamo-client.js';
import { DynamoGatewayLive } from '../../infrastructure/persistence/dynamo-gateway.js';
import { ProductMapperLive } from '../../infrastructure/persistence/product-mapper.js';
import { ProductServiceLive } from '../service/product-service.js';
import { CreateHandlerLive } from './handler/create-handler.js';
import { Handler } from './handler/handler.js';
import { CreateValidatorLive } from './validation/create-validator.js';
import { Validator } from './validation/validator.js';

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
    pipe(
      httpMethod,
      Match.value,
      Match.when('POST', () =>
        ValidOperationLive.pipe(
          Layer.provide(Layer.merge(CreateValidatorLive, CreateHandlerLive))
        )
      ),
      Match.option,
      Option.match({
        onNone: () => InvalidOperationLive,
        onSome: (operation) =>
          operation.pipe(
            Layer.provide(ProductServiceLive),
            Layer.provide(DynamoGatewayLive),
            Layer.provide(Layer.merge(DynamoClientLive, ProductMapperLive))
          ),
      })
    );
}

export const InvalidOperationLive = Layer.effect(
  Operation,
  Effect.succeed({
    exec: () => Effect.fail(new InvalidOperationError()),
  })
);

export const ValidOperationLive = Layer.effect(
  Operation,
  Effect.gen(function* (_) {
    const validator = yield* _(Validator);
    const handler = yield* _(Handler);

    return {
      exec: (params: RequestParams) =>
        pipe(
          Effect.gen(function* (_) {
            const args = yield* _(validator.validate(params));
            yield* _(handler.exec(args));
          }),
          Effect.mapError((error) => new ServiceError(error))
        ),
    };
  })
);
