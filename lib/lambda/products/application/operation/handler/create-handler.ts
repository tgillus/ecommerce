import { Effect } from 'effect';
import { ProductService } from '../../../domain/service/product-service.js';
import { CreateArgs } from '../args/create-args.js';
import { Handler } from './handler.js';

export class CreateHandler implements Handler {
  constructor(private readonly productService: ProductService) {}

  exec = (args: CreateArgs): Effect.Effect<void, Error> =>
    this.productService.create(args);
}
