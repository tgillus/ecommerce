import { nanoid } from 'nanoid';

export class IdGenerator {
  private generate() {
    return nanoid();
  }

  static generate() {
    return new IdGenerator().generate();
  }
}
