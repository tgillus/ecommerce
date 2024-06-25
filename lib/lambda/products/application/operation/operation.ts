import type { Effect } from "effect";
import type { InvalidOperationError } from "../../../common/application/error/invalid-operation-error.js";
import type { ServiceError } from "../../../common/application/error/service-error.js";
import type { ValidationError } from "../../../common/application/error/validation-error.js";
import type { RequestParams } from "../../../common/request/request-params.js";
import type { CreateArgs } from "./create/create-args.js";

export interface Operation {
	exec: (
		params: RequestParams,
	) => Effect.Effect<
		void,
		InvalidOperationError | ServiceError | ValidationError
	>;
}

type Args = CreateArgs;

export interface Validator {
	validate: (params: RequestParams) => Effect.Effect<Args, ValidationError>;
}

export interface Handler {
	exec: (args: Args) => Effect.Effect<void, ServiceError>;
}
