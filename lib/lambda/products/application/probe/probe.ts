import { Context, Effect, Layer } from 'effect';
import type { ValidationError } from '../../../common/application/error/validation-error.js';
import { AppLogger } from '../../infrastructure/logging/app-logger.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Probe extends Context.Tag('Probe')<
  Probe,
  {
    validRequestReceived: () => Effect.Effect<void>;
    invalidRequestReceived: () => Effect.Effect<void>;
    argsValidationSucceeded: () => Effect.Effect<void>;
    argsValidationFailed: (error: ValidationError) => Effect.Effect<void>;
    savingProductToDynamoSucceeded: () => Effect.Effect<void>;
    savingProductToDynamoFailed: (error: Error) => Effect.Effect<void>;
  }
>() {
  static build = () => ProbeLive.pipe(Layer.provide(AppLogger.build()));
}

export const ProbeLive = Layer.effect(
  Probe,
  Effect.gen(function* (_) {
    const logger = yield* _(AppLogger);

    return {
      validRequestReceived: () => logger.info('Valid request received.'),
      invalidRequestReceived: () =>
        logger.error(new Error('Invalid request received.')),
      argsValidationSucceeded: () =>
        logger.info('Arguments validation succeeded.'),
      argsValidationFailed: (error) => logger.error(error),
      savingProductToDynamoSucceeded: () =>
        logger.info('Saving product to dynamo succeeded .'),
      savingProductToDynamoFailed: logger.error,
    };
  })
);
