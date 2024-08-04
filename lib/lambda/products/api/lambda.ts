import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Effect } from 'effect';
import {
  RequestContext,
  RequestContextLive,
} from '../../common/request/request-context.js';
import { RequestParams } from '../../common/request/request-params.js';
import { Api } from './api.js';

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const params = new RequestParams(event);
  const program = Effect.gen(function* () {
    const requestContext = yield* RequestContext;
    const requestId = requestContext.requestId;
    yield* Effect.annotateLogsScoped('requestId', requestId);

    const api = yield* Api;
    return yield* api.handler(params);
  });

  return await Effect.runPromise(
    program.pipe(
      Effect.provide(Api.from(params)),
      Effect.provide(RequestContextLive),
      Effect.scoped
    )
  );
};
