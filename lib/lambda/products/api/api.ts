import type { APIGatewayProxyResult } from 'aws-lambda';
import { Context, Effect, Layer, Match, flow } from 'effect';
import type { RequestParams } from '../../common/request/request-params.js';
import { Response } from '../../common/response/response.js';
import { OpFactory } from '../application/operation/op-factory.js';
import { Operation } from '../application/operation/operation.js';
import { Probe } from '../application/probe/probe.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Api extends Context.Tag('Api')<
  Api,
  {
    handler: (params: RequestParams) => Effect.Effect<APIGatewayProxyResult>;
  }
>() {
  static from(params: RequestParams) {
    return ApiLive.pipe(
      Layer.provide(OpFactory.from(params)),
      Layer.provide(Probe.build())
    );
  }
}

const ApiLive = Layer.effect(
  Api,
  Effect.gen(function* () {
    const operation = yield* Operation;

    return {
      handler: (params) =>
        operation.exec(params).pipe(
          Effect.match({
            onFailure: flow(
              Match.value,
              Match.tags({
                InvalidOperationError: Response.serverError,
                NotFoundError: Response.notFound,
                ServiceError: Response.serverError,
                ValidationError: ({ issues }) =>
                  Response.badRequest({ issues }),
              }),
              Match.exhaustive
            ),
            onSuccess: Response.ok,
          })
        ),
    };
  })
);

export const ApiTest = Layer.succeed(Api, {
  handler: (_params: RequestParams) =>
    Effect.succeed(Response.ok({ foo: 'bar' })),
});
