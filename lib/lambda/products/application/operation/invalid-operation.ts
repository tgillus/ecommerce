import { Effect, Layer } from 'effect';
import { Operation } from './operation.js';

export const InvalidOperationLive = Layer.effect(
  Operation,
  Effect.succeed({
    exec: () => Effect.fail(new Error('invalid operation')),
  })
);
