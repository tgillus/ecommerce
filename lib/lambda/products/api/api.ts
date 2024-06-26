import type { APIGatewayProxyResult } from "aws-lambda";
import { Context, Effect, Layer, Match, flow } from "effect";
import type { RequestParams } from "../../common/request/request-params.js";
import { Response } from "../../common/response/response.js";
import { Operation } from "../application/operation/op-factory.js";
import { Probe } from "../application/probe/probe.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Api extends Context.Tag("Api")<
	Api,
	{
		handler: (params: RequestParams) => Effect.Effect<APIGatewayProxyResult>;
	}
>() {
	static from = (params: RequestParams) =>
		ApiLive.pipe(
			Layer.provide(Operation.from(params)),
			Layer.provide(Probe.build()),
		);
}

export const ApiLive = Layer.effect(
	Api,
	Effect.gen(function* () {
		const operation = yield* Operation;

		return {
			handler: (params) =>
				operation.exec(params).pipe(
					Effect.match({
						onFailure: flow(
							Match.value,
							Match.tags({
								InvalidOperationError: Response.fail,
								ServiceError: Response.fail,
								ValidationError: Response.fail,
							}),
							Match.exhaustive,
						),
						onSuccess: Response.success,
					}),
				),
		};
	}),
);
