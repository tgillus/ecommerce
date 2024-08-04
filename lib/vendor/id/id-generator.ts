import { Effect } from 'effect';
import { nanoid } from 'nanoid';

export class IdGenerator {
  private generate() {
    return Effect.succeed(nanoid());
  }

  static generate() {
    return new IdGenerator().generate();
  }
}
