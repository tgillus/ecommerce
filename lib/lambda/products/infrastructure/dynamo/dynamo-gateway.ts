import { Client } from '../../../common/vendor/dynamo/client.js';
import { Product } from '../../domain/model/product.js';
import { Config } from '../config/config.js';
import { ProductMapper } from './product-mapper.js';

export class DynamoGateway {
  constructor(
    private readonly client: Client,
    private readonly tableName: string,
    private readonly mapper: ProductMapper
  ) {}

  create = (product: Product) =>
    this.client.put(this.tableName, this.mapper.map(product));

  static from = ({ tableName }: Config) =>
    new DynamoGateway(new Client(), tableName, new ProductMapper());
}
