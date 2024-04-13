import { Effect, Exit } from 'effect';
import * as td from 'testdouble';
import { afterEach, expect, test } from 'vitest';
import { RequestParams } from '../../../../../../lib/lambda/common/request/request-params.js';
import { CreateArgs } from '../../../../../../lib/lambda/products/application/operation/args/create-args.js';
import { Handler } from '../../../../../../lib/lambda/products/application/operation/handler/handler.js';
import { Operation } from '../../../../../../lib/lambda/products/application/operation/operation.js';
import { Validator } from '../../../../../../lib/lambda/products/application/operation/validation/validator.js';

const validator = td.object<Validator>();
const handler = td.object<Handler>();
const params = td.object<RequestParams>();
const args = td.object<CreateArgs>();

const operation = td.object<Operation>();

afterEach(() => {
  td.reset();
});

test.skip('executes valid operations', () => {
  td.when(validator.validate(params)).thenReturn(Effect.succeed(args));
  td.when(handler.exec(args)).thenReturn(Effect.succeed('foo'));

  const result = operation.exec(params);

  expect(Exit.isSuccess(Effect.runSyncExit(result))).toEqual(true);
});

test.skip('returns error when validation fails', () => {
  const error = new Error('foo');
  td.when(validator.validate(params)).thenReturn(Effect.fail(error));

  const result = operation.exec(params);

  expect(Effect.runSyncExit(result)).toEqual(Exit.fail(error));
});

test.skip('executes invalid operations', () => {
  const operation = new InvalidOperation();

  const result = operation.exec();

  expect(Effect.runSyncExit(result)).toEqual(
    Exit.fail(new Error('invalid operation'))
  );
});
