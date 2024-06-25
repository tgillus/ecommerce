import { Context, Effect, Layer } from "effect";
import { InvalidOperationError } from "../../../../common/application/error/invalid-operation-error.js";
import { Probe } from "../../probe/probe.js";
import type { Operation } from "../operation.js";

export class InvalidOperation extends Context.Tag("InvalidOperation")<
	InvalidOperation,
	Operation
>() {}

export const InvalidOperationLive = Layer.effect(
	InvalidOperation,
	Effect.gen(function* () {
		const probe = yield* Probe;

		return {
			exec: () =>
				probe
					.invalidRequestReceived()
					.pipe(Effect.andThen(() => Effect.fail(new InvalidOperationError()))),
		};
	}),
);
