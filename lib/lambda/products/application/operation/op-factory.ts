import { Match, Option, identity } from "effect";
import type { RequestParams } from "../../../common/request/request-params.js";
import { CreateOperation } from "./create/create-operation.js";
import { InvalidOperationLive } from "./invalid/invalid-operation.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class OpFactory {
	static from = ({ httpMethod }: RequestParams) =>
		Match.value(httpMethod).pipe(
			Match.when("POST", () => CreateOperation.build()),
			Match.option,
			Option.match({
				onNone: () => InvalidOperationLive,
				onSome: identity,
			}),
		);
}
