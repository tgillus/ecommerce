import { Context, Effect, Layer } from 'effect';
import { RequestParams } from '../../common/request/request-params.js';
import { Operation } from '../application/operation/operation.js';

export class Api extends Context.Tag('Api')<
  Api,
  {
    handler: (params: RequestParams) => Effect.Effect<void, Error>;
  }
>() {
  static from = (params: RequestParams) =>
    ApiLive.pipe(Layer.provide(Operation.from(params)));
}

export const ApiLive = Layer.effect(
  Api,
  Effect.gen(function* (_) {
    const operation = yield* _(Operation);

    return {
      handler: (params) => operation.exec(params),
    };
  })
);
