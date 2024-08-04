import { Context, Effect, Layer } from 'effect';
import { IdGenerator } from '../../../vendor/id/id-generator.js';

export class RequestContext extends Context.Tag('RequestContext')<
  RequestContext,
  {
    requestId: string;
  }
>() {}

export const RequestContextLive = Layer.effect(
  RequestContext,
  Effect.gen(function* () {
    const generate = yield* cachedGenerate;

    return {
      requestId: yield* generate,
    };
  })
);

export const RequestContextTest = Layer.succeed(RequestContext, {
  requestId: 'foo',
});

const cachedGenerate = Effect.cached(IdGenerator.generate());
