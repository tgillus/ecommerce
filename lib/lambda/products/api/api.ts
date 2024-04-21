import { APIGatewayProxyResult } from 'aws-lambda';
import { Context, Effect, Layer, Match, flow } from 'effect';
import { RequestParams } from '../../common/request/request-params.js';
import { Response } from '../../common/response/response.js';
import { Operation } from '../application/operation/operation.js';
import { Probe } from '../application/probe/probe.js';

export class Api extends Context.Tag('Api')<
  Api,
  {
    handler: (params: RequestParams) => Effect.Effect<APIGatewayProxyResult>;
  }
>() {
  static from = (params: RequestParams) =>
    ApiLive.pipe(
      Layer.provide(Layer.merge(Operation.from(params), Probe.build()))
    );
}

export const ApiLive = Layer.effect(
  Api,
  Effect.gen(function* (_) {
    const operation = yield* _(Operation);
    const probe = yield* _(Probe);

    return {
      handler: (params) =>
        probe.requestReceived().pipe(
          Effect.flatMap(() => operation.exec(params)),
          Effect.match({
            onFailure: flow(
              Match.value,
              Match.tags({
                InvalidOperationError: Response.fail,
                ServiceError: Response.fail,
                ValidationError: Response.fail,
              }),
              Match.exhaustive
            ),
            onSuccess: Response.success,
          })
        ),
    };
  })
);
