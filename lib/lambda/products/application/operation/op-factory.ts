import { Data, Match, Option, pipe } from 'effect';
import { RequestParams } from '../../../common/request/request-params.js';
import { CreateHandler } from './handler/create-handler.js';
import { InvalidOperation, Operation, ValidOperation } from './operation.js';
import { CreateValidator } from './validation/create-validator.js';

export class OpFactory {
  static from = ({ httpMethod }: RequestParams): Operation =>
    pipe(
      httpMethod,
      Match.value,
      Match.when('POST', () =>
        Data.tuple(new CreateValidator(), new CreateHandler())
      ),
      Match.option,
      Option.match({
        onNone: () => new InvalidOperation(),
        onSome: ([validator, handler]) =>
          new ValidOperation(validator, handler),
      })
    );
}
