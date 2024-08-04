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
  const { firstRequestId, secondRequestId } = Effect.runSync(
    Effect.Do.pipe(
      Effect.bind('firstRequestId', () =>
        Effect.gen(function* () {
          const requestContext = yield* RequestContext;
          return requestContext.requestId;
        })
      ),
      Effect.bind('secondRequestId', () =>
        Effect.gen(function* () {
          const requestContext = yield* RequestContext;
          return requestContext.requestId;
        })
      ),
      Effect.andThen(({ firstRequestId, secondRequestId }) => ({
        firstRequestId,
        secondRequestId,
      })),
      Effect.provide(RequestContextLive)
    )
  );

  expect(firstRequestId).toStrictEqual(secondRequestId);
});
