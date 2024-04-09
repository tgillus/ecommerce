import { Data, Match, Option, pipe } from 'effect';
import { RequestParams } from '../../../common/request/request-params.js';
import { Config } from '../../infrastructure/config/config.js';
import { ProductIntegrationService } from '../service/product-integration-service.js';
import { CreateHandler } from './handler/create-handler.js';
import { InvalidOperation, Operation, ValidOperation } from './operation.js';
import { CreateValidator } from './validation/create-validator.js';

export class OpFactory {
  static from = ({ httpMethod }: RequestParams, config: Config): Operation =>
    pipe(
      httpMethod,
      Match.value,
      Match.when('POST', () =>
        Data.tuple(
          new CreateValidator(),
          new CreateHandler(ProductIntegrationService.from(config))
        )
      ),
      Match.option,
      Option.match({
        onNone: () => new InvalidOperation(),
        onSome: ([validator, handler]) =>
          new ValidOperation(validator, handler),
      })
    );
}
