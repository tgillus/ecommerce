import { Context, Layer } from 'effect';
import { IdGenerator } from '../../../vendor/id/id-generator.js';

export class RequestContext extends Context.Tag('RequestContext')<
  RequestContext,
  {
    requestId: () => string;
  }
>() {}

export const RequestContextLive = Layer.succeed(RequestContext, {
  requestId: () => IdGenerator.generate(),
});
