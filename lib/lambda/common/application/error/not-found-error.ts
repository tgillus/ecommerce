import { Data } from 'effect';

export class NotFoundError extends Data.TaggedError('NotFoundError')<{
  message: string;
  name: 'NotFoundError';
}> {
  constructor(message: string) {
    super({ message, name: 'NotFoundError' });
  }
}
