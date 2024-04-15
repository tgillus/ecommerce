import { Data } from 'effect';

export class InvalidOperationError extends Data.TaggedError(
  'InvalidOperationError'
)<{
  message: 'Invalid operation';
  name: 'InvalidOperationError';
}> {
  constructor() {
    super({ message: 'Invalid operation', name: 'InvalidOperationError' });
  }
}
