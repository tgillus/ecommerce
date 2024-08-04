import { Schema } from '@effect/schema';

export interface Product
  extends Schema.Schema.Type<typeof CreateProductSchema> {}

export const CreateProductSchema = Schema.Struct({
  description: Schema.Trim.pipe(Schema.nonEmptyString(), Schema.maxLength(200)),
  name: Schema.Trim.pipe(Schema.nonEmptyString(), Schema.maxLength(50)),
  price: Schema.Trim.pipe(
    Schema.nonEmptyString(),
    Schema.pattern(/^\d{1,5}\.\d{2}$/)
  ),
});
