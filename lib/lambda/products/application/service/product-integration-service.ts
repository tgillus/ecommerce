import { ProductService } from '../../domain/service/product-service.js';
import { Config } from '../../infrastructure/config/config.js';
import { DynamoGateway } from '../../infrastructure/dynamo/dynamo-gateway.js';
import { CreateArgs } from '../operation/args/create-args.js';

export class ProductIntegrationService implements ProductService {
  constructor(private readonly dynamoGateway: DynamoGateway) {}

  create = ({ product }: CreateArgs) => this.dynamoGateway.create(product);

  static from = (config: Config) =>
    new ProductIntegrationService(DynamoGateway.from(config));
}
