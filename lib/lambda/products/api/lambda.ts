import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Effect, Layer } from 'effect';
import { RequestParams } from '../../common/request/request-params.js';
import { Probe } from '../application/probe/probe.js';
import { Api } from './api.js';

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const params = new RequestParams(event);
  const program = Effect.gen(function* (_) {
    const api = yield* _(Api);
    return yield* _(api.handler(params));
  });
  const layer = Api.from(params).pipe(Layer.provide(Probe.build()));

  return await Effect.runPromise(Effect.provide(program, layer));
};
