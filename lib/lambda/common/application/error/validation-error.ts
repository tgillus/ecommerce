import { Data } from 'effect';

export class ValidationError extends Data.TaggedError('ValidationError')<{
  issues: ReadonlyArray<{
    readonly message: string;
    readonly path: ReadonlyArray<PropertyKey>;
  }>;
  message: 'Validation error';
  name: 'ValidationError';
}> {
  constructor(
    issues: ReadonlyArray<{
      readonly message: string;
      readonly path: ReadonlyArray<PropertyKey>;
    }>
  ) {
    super({
      issues,
      message: 'Validation error',
      name: 'ValidationError',
    });
  }
}
