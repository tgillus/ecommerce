import type { Issue } from '@effect/schema/ArrayFormatter';
import type { APIGatewayEvent } from 'aws-lambda';
import { Effect, Layer } from 'effect';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { InvalidOperationError } from '../../../../../lib/lambda/common/application/error/invalid-operation-error.js';
import { NotFoundError } from '../../../../../lib/lambda/common/application/error/not-found-error.js';
import { ServiceError } from '../../../../../lib/lambda/common/application/error/service-error.js';
import { ValidationError } from '../../../../../lib/lambda/common/application/error/validation-error.js';
import { RequestParams } from '../../../../../lib/lambda/common/request/request-params.js';
import { Response } from '../../../../../lib/lambda/common/response/response.js';
import { Api } from '../../../../../lib/lambda/products/api/api.js';
import { OpFactory } from '../../../../../lib/lambda/products/application/operation/op-factory.js';
import { Operation } from '../../../../../lib/lambda/products/application/operation/operation.js';
import {
  Probe,
  ProbeTest,
} from '../../../../../lib/lambda/products/application/probe/probe.js';

const event = td.object<APIGatewayEvent>();
const params = new RequestParams(event);
const program = Effect.gen(function* () {
  const api = yield* Api;
  return yield* api.handler(params);
});

beforeEach(() => {
  td.replace(OpFactory, 'from');
  td.replace(Probe, 'build');
});

afterEach(() => {
  td.reset();
});

test('returns success result', async () => {
  const layer = Layer.succeed(Operation, {
    exec: () => Effect.succeed({ foo: 'bar' }),
  });
  td.when(OpFactory.from(params)).thenReturn(layer);
  td.when(Probe.build()).thenReturn(ProbeTest);
  const api = Api.from(params);

  const result = await Effect.runPromise(program.pipe(Effect.provide(api)));

  expect(result).toEqual(Response.ok({ foo: 'bar' }));
});

test('returns invalid operation result', async () => {
  const layer = Layer.succeed(Operation, {
    exec: () => Effect.fail(new InvalidOperationError()),
  });
  td.when(OpFactory.from(params)).thenReturn(layer);
  td.when(Probe.build()).thenReturn(ProbeTest);
  const api = Api.from(params);

  const result = await Effect.runPromise(program.pipe(Effect.provide(api)));

  expect(result).toEqual(Response.serverError());
});

test('returns not found result', async () => {
  const layer = Layer.succeed(Operation, {
    exec: () => Effect.fail(new NotFoundError('foo')),
  });
  td.when(OpFactory.from(params)).thenReturn(layer);
  td.when(Probe.build()).thenReturn(ProbeTest);
  const api = Api.from(params);

  const result = await Effect.runPromise(program.pipe(Effect.provide(api)));

  expect(result).toEqual(Response.notFound());
});

test('returns server error result', async () => {
  const layer = Layer.succeed(Operation, {
    exec: () => Effect.fail(new ServiceError({ message: 'foo', name: 'bar' })),
  });
  td.when(OpFactory.from(params)).thenReturn(layer);
  td.when(Probe.build()).thenReturn(ProbeTest);
  const api = Api.from(params);

  const result = await Effect.runPromise(program.pipe(Effect.provide(api)));

  expect(result).toEqual(Response.serverError());
});

test('returns validation error result', async () => {
  const issues = new Array<Issue>();
  const layer = Layer.succeed(Operation, {
    exec: () => Effect.fail(new ValidationError(issues)),
  });
  td.when(OpFactory.from(params)).thenReturn(layer);
  td.when(Probe.build()).thenReturn(ProbeTest);
  const api = Api.from(params);

  const result = await Effect.runPromise(program.pipe(Effect.provide(api)));

  expect(result).toEqual(Response.badRequest({ issues }));
});
