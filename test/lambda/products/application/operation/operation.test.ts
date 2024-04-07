import { Effect, Exit } from 'effect';
import * as td from 'testdouble';
import { afterEach, expect, test } from 'vitest';
import { CreateArgs } from '../../../../../lib/lambda/products/application/operation/args/create-args.js';
import { Handler } from '../../../../../lib/lambda/products/application/operation/handler/handler.js';
import {
  InvalidOperation,
  ValidOperation,
} from '../../../../../lib/lambda/products/application/operation/operation.js';
import { Validator } from '../../../../../lib/lambda/products/application/operation/validation/validator.js';

const validator = td.object<Validator>();
const handler = td.object<Handler>();
const args = td.object<CreateArgs>();
const data = 'foo';

const operation = new ValidOperation(validator, handler);

afterEach(() => {
  td.reset();
});

test('executes valid operations', () => {
  td.when(validator.validate(data)).thenReturn(Effect.succeed(args));
  td.when(handler.handle(args)).thenReturn(Effect.succeed('bar'));

  const result = operation.exec(data);

  expect(Effect.runSync(result)).toEqual('bar');
});

test('returns error when validation fails', () => {
  const error = new Error('bar');
  td.when(validator.validate(data)).thenReturn(Effect.fail(error));

  const result = operation.exec(data);

  expect(Effect.runSyncExit(result)).toEqual(Exit.fail(error));
});

test('executes invalid operations', () => {
  const operation = new InvalidOperation();

  const result = operation.exec();

  expect(Effect.runSyncExit(result)).toEqual(
    Exit.fail(new Error('invalid operation'))
  );
});
