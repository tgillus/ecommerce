import { Data } from 'effect';

export class ServiceError extends Data.TaggedError('ServiceError')<{
  message: string;
  name: string;
}> {
  constructor({ message, name }: Error) {
    super({ message, name });
  }
}
