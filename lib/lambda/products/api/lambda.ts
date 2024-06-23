import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Effect } from 'effect';
import { RequestParams } from '../../common/request/request-params.js';
import { Api } from './api.js';

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const params = new RequestParams(event);
  const program = Effect.gen(function* () {
    const api = yield* Api;
    return yield* api.handler(params);
  });

  return await Effect.runPromise(Effect.provide(program, Api.from(params)));
};
