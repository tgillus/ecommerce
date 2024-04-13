import { Issue } from '@effect/schema/ArrayFormatter';
import { Context, Effect, Layer, Match, Option, pipe } from 'effect';
import { RequestParams } from '../../../common/request/request-params.js';
import { DynamoClientLive } from '../../../common/vendor/dynamo/dynamo-client.js';
import { DynamoGatewayLive } from '../../infrastructure/dynamo/dynamo-gateway.js';
import { ProductMapperLive } from '../../infrastructure/dynamo/product-mapper.js';
import { ProductServiceLive } from '../service/product-service.js';
import { CreateOperationLive } from './create-operation.js';
import { CreateHandlerLive } from './handler/create-handler.js';
import { InvalidOperationLive } from './invalid-operation.js';
import { CreateValidatorLive } from './validation/create-validator.js';

export class Operation extends Context.Tag('Operation')<
  Operation,
  {
    exec: (params: RequestParams) => Effect.Effect<void, Error | Issue[]>;
  }
>() {
  static from = ({ httpMethod }: RequestParams) =>
    pipe(
      httpMethod,
      Match.value,
      Match.when('POST', () =>
        CreateOperationLive.pipe(
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
