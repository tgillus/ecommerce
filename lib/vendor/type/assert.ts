import { assert } from '@sindresorhus/is';

export class Assert {
  string(value: unknown): asserts value is string {
    assert.string(value);
  }
}
