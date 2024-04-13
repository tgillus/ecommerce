import { Effect, Layer } from 'effect';
import { Operation } from './operation.js';

export const InvalidOperationLive = Layer.succeed(
  Operation,
  Operation.of({
    exec: () => Effect.fail(new Error('invalid operation')),
  })
);
