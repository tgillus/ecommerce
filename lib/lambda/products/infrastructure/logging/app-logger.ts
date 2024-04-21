import { Context, Effect, Inspectable, Layer, Logger } from 'effect';
import { IdGenerator } from '../../../../vendor/id/id-generator.js';

export class AppLogger extends Context.Tag('AppLogger')<
  AppLogger,
  {
    info: (message: string) => Effect.Effect<void>;
  }
>() {
  static build = () =>
    AppLoggerLive.pipe(
      Layer.provide(Logger.replace(Logger.defaultLogger, jsonLogger))
    );
}

export const AppLoggerLive = Layer.succeed(AppLogger, {
  info: (message: string) => Effect.log(message),
});

const jsonLogger = Logger.make(
  ({ logLevel: { label: _logLevel }, message: msg }) => {
    globalThis.console.log(
      Inspectable.stringifyCircular({
        _logLevel,
        id: IdGenerator.generate(),
        msg,
        timestamp: new Date().toISOString(),
      })
    );
  }
);

// const program = AppLogger.pipe(
//   Effect.flatMap((logger) => logger.info('Hello, World!'))
// );
// Effect.runSync(Effect.provide(program, AppLogger.build()));
