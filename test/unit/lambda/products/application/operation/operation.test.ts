import { Effect, Exit, Layer } from "effect";
import assert from "node:assert";
import * as td from "testdouble";
import { afterEach, test } from "vitest";
import { InvalidOperationError } from "../../../../../../lib/lambda/common/application/error/invalid-operation-error.js";
import { RequestParams } from "../../../../../../lib/lambda/common/request/request-params.js";
import { CreateHandlerTest } from "../../../../../../lib/lambda/products/application/operation/create/create-handler.js";
import { CreateOperationLive } from "../../../../../../lib/lambda/products/application/operation/create/create-operation.js";
import { CreateValidatorTest } from "../../../../../../lib/lambda/products/application/operation/create/create-validator.js";
import { InvalidOperationLive } from "../../../../../../lib/lambda/products/application/operation/invalid/invalid-operation.js";
import { OpFactory } from "../../../../../../lib/lambda/products/application/operation/op-factory.js";
import { ProbeTest } from "../../../../../../lib/lambda/products/application/probe/probe.js";

const params = td.object<RequestParams>();

const program = Effect.gen(function* () {
	const operation = yield* Operation;
	return yield* operation.exec(params);
});

afterEach(() => {
	td.reset();
});

test.skip("executes invalid operations", () => {
	const operation = InvalidOperationLive.pipe(Layer.provide(ProbeTest));
	const runnable = Effect.provide(program, operation);

	const result = Effect.runSyncExit(runnable);

	assert.deepStrictEqual(result, Exit.fail(new InvalidOperationError()));
});

test.skip("executes valid operations", () => {
	const operation = CreateOperationLive.pipe(
		Layer.provide(Layer.merge(CreateValidatorTest, CreateHandlerTest)),
		Layer.provide(ProbeTest),
	);
	const runnable = Effect.provide(program, operation);

	const result = Effect.runSyncExit(runnable);

	assert.deepStrictEqual(result, Exit.void);
});

test.skip("builds an invalid operation layer", () => {
	const params = new RequestParams({ body: "foo", httpMethod: "bar" });

	assert.deepStrictEqual(OpFactory.from(params), InvalidOperationLive);
});

test.skip("builds an valid operation layer", () => {
	const params = new RequestParams({ body: "foo", httpMethod: "POST" });
});
