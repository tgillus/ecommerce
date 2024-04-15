import { Data } from 'effect';

export class InvalidRequestError extends Data.TaggedError(
  'InvalidRequestError'
)<{
  message: 'Invalid request';
  name: 'InvalidRequestError';
}> {
  constructor() {
    super({ message: 'Invalid request', name: 'InvalidRequestError' });
  }
}
