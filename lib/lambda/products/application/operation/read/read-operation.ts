import { Effect, Layer } from 'effect';
import type { RequestParams } from '../../../../common/request/request-params.js';
import { Probe } from '../../probe/probe.js';
import { ProductService } from '../../service/product-service.js';
import { Operation } from '../operation.js';
import { ReadHandler, ReadHandlerLive } from './read-handler.js';
import { ReadValidator, ReadValidatorLive } from './read-validator.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ReadOperation {
  static build = () =>
    ReadOperationLive.pipe(
      Layer.provide(Layer.merge(ReadValidatorLive, ReadHandlerLive)),
      Layer.provide(ProductService.build())
    );
}

export const ReadOperationLive = Layer.effect(
  Operation,
  Effect.gen(function* () {
    const validator = yield* ReadValidator;
    const handler = yield* ReadHandler;
    const probe = yield* Probe;

    return {
      exec: (params: RequestParams) =>
        probe.validRequestReceived().pipe(
          Effect.andThen(() => validator.validate(params)),
          Effect.andThen(handler.exec),
          Effect.andThen((item) => ({ item }))
        ),
    };
  })
);

export const ReadOperationTest = Layer.succeed(Operation, {
  exec: (_params: RequestParams) => Effect.succeed({ foo: 'bar' }),
});
