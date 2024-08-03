import { Effect, Exit } from 'effect';
import assert from 'node:assert';
import * as td from 'testdouble';
import { afterEach, beforeEach, test } from 'vitest';
import {
  Probe,
  ProbeTest,
} from '../../../../../../lib/lambda/products/application/probe/probe.js';

beforeEach(() => {
  td.replace(Probe, 'build');
});

afterEach(() => {
  td.reset();
});

test('builds a probe', () => {
  td.when(Probe.build()).thenReturn(ProbeTest);
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
