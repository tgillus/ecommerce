import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Effect, Exit, pipe } from 'effect';
import { RequestParams } from '../../common/request/request-params.js';
import { Response } from '../../common/response/response.js';
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
  const runnable = Effect.provide(program, api);

  return pipe(
    await Effect.runPromiseExit(runnable),
    Exit.match({
      onFailure: Response.fail,
      onSuccess: Response.success,
    })
  );
};
