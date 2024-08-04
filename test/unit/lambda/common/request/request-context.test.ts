import { Effect } from 'effect';
import { expect, test } from 'vitest';
import {
  RequestContext,
  RequestContextLive,
} from '../../../../../lib/lambda/common/request/request-context.js';

test('returns request id', () => {
  const program = Effect.gen(function* () {
    const requestContext = yield* RequestContext;

    return requestContext.requestId;
  });

  const requestId = Effect.runSync(
    program.pipe(Effect.provide(RequestContextLive))
  );

  expect(requestId).toBeTypeOf('string');
});

test('caches request id', () => {
  const program = Effect.gen(function* () {
    const requestContext = yield* RequestContext;

    return requestContext.requestId;
  });
  const runnable = program.pipe(Effect.provide(RequestContextLive));

  const requestId = Effect.runSync(runnable);
  const anotherRequestId = Effect.runSync(runnable);

  expect(requestId).toStrictEqual(anotherRequestId);
});
