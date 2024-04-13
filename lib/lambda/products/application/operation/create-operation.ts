import { Effect, Layer } from 'effect';
import { RequestParams } from '../../../common/request/request-params.js';
import { CreateHandler } from './handler/create-handler.js';
import { Operation } from './operation.js';
import { CreateValidator } from './validation/create-validator.js';

export const CreateOperationLive = Layer.effect(
  Operation,
  Effect.gen(function* (_) {
    const validator = yield* _(CreateValidator);
    const handler = yield* _(CreateHandler);

    return {
      exec: (params: RequestParams) =>
        Effect.gen(function* (_) {
          const args = yield* _(validator.validate(params));
          yield* _(handler.exec(args));
        }),
    };
  })
);
