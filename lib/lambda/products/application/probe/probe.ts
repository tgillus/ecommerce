import { Context, Effect, Layer } from 'effect';
import type { ValidationError } from '../../../common/application/error/validation-error.js';
import { AppLogger } from '../../infrastructure/logging/app-logger.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Probe extends Context.Tag('Probe')<
  Probe,
  {
    validRequestReceived(): Effect.Effect<void>;
    invalidRequestReceived(): Effect.Effect<void>;
    argsValidationSucceeded(): Effect.Effect<void>;
    argsValidationFailed(error: ValidationError): Effect.Effect<void>;
    savingProductToDynamoSucceeded(): Effect.Effect<void>;
    savingProductToDynamoFailed(error: Error): Effect.Effect<void>;
    readingProductFromDynamoSucceeded(): Effect.Effect<void>;
    readingProductFromDynamoFailed(error: Error): Effect.Effect<void>;
  }
>() {
  static build() {
    return ProbeLive.pipe(Layer.provide(AppLogger.build()));
  }
}

export const ProbeLive = Layer.effect(
  Probe,
  Effect.gen(function* () {
    const logger = yield* AppLogger;

    return {
      validRequestReceived: () => logger.info('Valid request received.'),
      invalidRequestReceived: () =>
        logger.error(new Error('Invalid request received.')),
      argsValidationSucceeded: () =>
        logger.info('Arguments validation succeeded.'),
      argsValidationFailed: (error) => logger.error(error),
      savingProductToDynamoSucceeded: () =>
        logger.info('Saving product to dynamo succeeded.'),
      savingProductToDynamoFailed: (error: Error) => logger.error(error),
      readingProductFromDynamoSucceeded: () =>
        logger.info('Reading product from dynamo succeeded.'),
      readingProductFromDynamoFailed: (error: Error) => logger.error(error),
    };
  })
);

export const ProbeTest = Layer.succeed(Probe, {
  invalidRequestReceived: () => Effect.void,
  validRequestReceived: () => Effect.void,
  argsValidationSucceeded: () => Effect.void,
  argsValidationFailed: () => Effect.void,
  savingProductToDynamoSucceeded: () => Effect.void,
  savingProductToDynamoFailed: () => Effect.void,
  readingProductFromDynamoSucceeded: () => Effect.void,
  readingProductFromDynamoFailed: () => Effect.void,
});
