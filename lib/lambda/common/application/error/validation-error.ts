import type { Issue } from '@effect/schema/ArrayFormatter';
import { Data } from 'effect';

export class ValidationError extends Data.TaggedError('ValidationError')<{
  issues: ReadonlyArray<Issue>;
  message: 'Validation error';
  name: 'ValidationError';
}> {
  constructor(issues: ReadonlyArray<Issue>) {
    super({ issues, message: 'Validation error', name: 'ValidationError' });
  }
}
