import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Effect } from 'effect';
import { RequestParams } from '../../common/request/request-params.js';
import { Api } from './api.js';

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const params = new RequestParams(event);
  const api = Api.from(params);
  const program = Effect.gen(function* (_) {
    const api = yield* _(Api);
    return yield* _(api.handler(params));
  });

  return await Effect.runPromise(Effect.provide(program, api));
};
