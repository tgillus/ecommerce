import { nanoid } from 'nanoid';

export class IdGenerator {
  generate = () => nanoid();

  static generate = () => new IdGenerator().generate();
}
