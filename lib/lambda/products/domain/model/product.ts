import * as S from '@effect/schema/Schema';

// export interface Product {
//   readonly description: string;
//   readonly name: string;
//   readonly price: string;
// }

export type Product = S.Schema.Type<typeof CreateProductSchema>;

export const CreateProductSchema = S.Struct({
  description: S.String,
  name: S.String,
  price: S.String,
});
