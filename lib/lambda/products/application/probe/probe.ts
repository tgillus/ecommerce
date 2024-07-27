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
      validRequestReceived() {
        return logger.info('Valid request received.');
      },
      invalidRequestReceived() {
        return logger.error(new Error('Invalid request received.'));
      },
      argsValidationSucceeded() {
        return logger.info('Arguments validation succeeded.');
      },
      argsValidationFailed(error) {
        return logger.error(error);
      },
      savingProductToDynamoSucceeded() {
        return logger.info('Saving product to dynamo succeeded.');
      },
      savingProductToDynamoFailed(error: Error) {
        return logger.error(error);
      },
    };
  })
);

export const ProbeTest = Layer.succeed(Probe, {
  invalidRequestReceived() {
    return Effect.void;
  },
  validRequestReceived() {
    return Effect.void;
  },
  argsValidationSucceeded() {
    return Effect.void;
  },
  argsValidationFailed() {
    return Effect.void;
  },
  savingProductToDynamoSucceeded() {
    return Effect.void;
  },
  savingProductToDynamoFailed() {
    return Effect.void;
  },
});
