import { Context, Layer } from "effect";
import { IdGenerator } from "../../../../vendor/id/id-generator.js";
import { Time } from "../../../../vendor/type/time.js";
import type { Product } from "../../domain/model/product.js";

export class ProductMapper extends Context.Tag("ProductMapper")<
	ProductMapper,
	{
		map: (product: Product) => Record<string, string>;
	}
>() {}

export const ProductMapperLive = Layer.succeed(ProductMapper, {
	map: ({ description, name, price }) => ({
		PK: `PRODUCT#${IdGenerator.generate()}`,
		SK: `PRODUCT#${Time.now().toISOString()}`,
		Description: description,
		Name: name,
		Price: price,
	}),
});
