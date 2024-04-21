import { Context, Effect, Layer } from 'effect';
import { AppLogger } from '../../infrastructure/logging/app-logger.js';

export class Probe extends Context.Tag('Probe')<
  Probe,
  {
    requestReceived: () => Effect.Effect<void>;
  }
>() {
  static build = () => ProbeLive.pipe(Layer.provide(AppLogger.build()));
}

export const ProbeLive = Layer.effect(
  Probe,
  Effect.gen(function* (_) {
    const logger = yield* _(AppLogger);

    return {
      requestReceived: () => logger.info('Request received'),
    };
  })
);
