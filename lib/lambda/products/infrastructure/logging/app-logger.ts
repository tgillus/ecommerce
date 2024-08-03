import { Context, Effect, Inspectable, Layer, Logger } from 'effect';
import { IdGenerator } from '../../../../vendor/id/id-generator.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AppLogger extends Context.Tag('AppLogger')<
  AppLogger,
  {
    error: (error: Error) => Effect.Effect<void>;
    info: (message: string) => Effect.Effect<void>;
  }
>() {
  static build() {
    return AppLoggerLive.pipe(
      Layer.provide(Logger.replace(Logger.defaultLogger, jsonLogger))
    );
  }
}

const AppLoggerLive = Layer.succeed(AppLogger, {
  error: (error: Error) =>
    Effect.logError(error.message).pipe(
      Effect.andThen(() => Effect.logError(error.stack))
    ),
  info: (message: string) => Effect.log(message),
});

const jsonLogger = Logger.make(
  ({ date, logLevel: { label: _logLevel }, message: msg }) => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    globalThis.console.log(
      Inspectable.stringifyCircular({
        _logLevel,
        id: IdGenerator.generate(),
        msg,
        timestamp: date.toISOString(),
      })
    );
  }
);

export const AppLoggerTest = Layer.succeed(AppLogger, {
  error: (_error: Error) => Effect.void,
  info: (_message: string) => Effect.void,
});
