import { Effect } from 'effect';

export class SafeJson {
  private parse(text: string) {
    return Effect.try<unknown>(() => JSON.parse(text));
  }

  static parse(text: string) {
    return new SafeJson().parse(text);
  }
}
