import { Effect, Layer } from 'effect';
import { InvalidOperationError } from '../../../../common/application/error/invalid-operation-error.js';
import { Probe } from '../../probe/probe.js';
import { Operation } from '../operation.js';

export const InvalidOperationLive = Layer.effect(
  Operation,
  Effect.gen(function* () {
    const probe = yield* Probe;

    return {
      exec: () =>
        probe
          .invalidRequestReceived()
          .pipe(Effect.andThen(() => Effect.fail(new InvalidOperationError()))),
    };
  })
);
