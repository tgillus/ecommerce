import { Context, Effect, Layer } from "effect";
import type { RequestParams } from "../../../../common/request/request-params.js";
import { Probe } from "../../probe/probe.js";
import { ProductService } from "../../service/product-service.js";
import type { Operation } from "../operation.js";
import { CreateHandler, CreateHandlerLive } from "./create-handler.js";
import { CreateValidator, CreateValidatorLive } from "./create-validator.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CreateOperation extends Context.Tag("CreateOperation")<
	CreateOperation,
	Operation
>() {
	static build = () =>
		CreateOperationLive.pipe(
			Layer.provide(Layer.merge(CreateValidatorLive, CreateHandlerLive)),
			Layer.provide(ProductService.build()),
		);
}

export const CreateOperationLive = Layer.effect(
	CreateOperation,
	Effect.gen(function* () {
		const validator = yield* CreateValidator;
		const handler = yield* CreateHandler;
		const probe = yield* Probe;

		return {
			exec: (params: RequestParams) =>
				probe.validRequestReceived().pipe(
					Effect.andThen(() => validator.validate(params)),
					Effect.andThen(handler.exec),
				),
		};
	}),
);
