import { Effect } from 'effect';

export class SafeJson {
  parse = (text: string) => Effect.try<unknown>(() => JSON.parse(text));
}
