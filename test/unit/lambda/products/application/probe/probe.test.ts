import { Effect, Exit } from 'effect';
import assert from 'node:assert';
import * as td from 'testdouble';
import { afterEach, beforeEach, test } from 'vitest';
import { Probe } from '../../../../../../lib/lambda/products/application/probe/probe.js';
import {
  AppLogger,
  AppLoggerTest,
} from '../../../../../../lib/lambda/products/infrastructure/logging/app-logger.js';

beforeEach(() => {
  td.replace(AppLogger, 'build');
});

afterEach(() => {
  td.reset();
});

test('builds a probe', () => {
  td.when(AppLogger.build()).thenReturn(AppLoggerTest);
  const probe = Probe.build();
  const program = Effect.gen(function* () {
    const probe = yield* Probe;
    return yield* probe.validRequestReceived();
  });

  assert.deepStrictEqual(
    Effect.runSyncExit(program.pipe(Effect.provide(probe))),
    Exit.void
  );
});
