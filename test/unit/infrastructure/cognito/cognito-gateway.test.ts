import { Effect, Exit, Layer } from 'effect';
import { NoSuchElementException } from 'effect/Cause';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import {
  CognitoGateway,
  CognitoGatewayLive,
} from '../../../../lib/infrastructure/cognito/cognito-gateway.js';
import {
  CognitoClient,
  CognitoClientClientIdFailureTest,
  CognitoClientClientSecretFailureTest,
  CognitoClientSuccessTest,
  CognitoClientUserPoolIdFailureTest,
} from '../../../../lib/vendor/aws/cognito/cognito-client.js';

const userPoolName = 'qux';
const userPoolClientName = 'quux';

const program = Effect.gen(function* () {
  const cognitoGateway = yield* CognitoGateway;
  return yield* cognitoGateway.credentials(userPoolName, userPoolClientName);
});

beforeEach(() => {
  td.replace(CognitoClient, 'build');
});

afterEach(() => {
  td.reset();
});

test('builds an cognito gateway', async () => {
  td.when(CognitoClient.build()).thenReturn(CognitoClientSuccessTest);
  const runnable = program.pipe(Effect.provide(CognitoGateway.build()));

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    clientId: 'bar',
    clientSecret: 'baz',
    userPoolId: 'foo',
  });
});

test('retrieves credentials', async () => {
  const runnable = program.pipe(
    Effect.provide(
      CognitoGatewayLive.pipe(Layer.provide(CognitoClientSuccessTest))
    )
  );

  expect(await Effect.runPromise(runnable)).toStrictEqual({
    clientId: 'bar',
    clientSecret: 'baz',
    userPoolId: 'foo',
  });
});

test('returns error when user pool id not returned', async () => {
  const runnable = program.pipe(
    Effect.provide(
      CognitoGatewayLive.pipe(Layer.provide(CognitoClientUserPoolIdFailureTest))
    )
  );

  expect(await Effect.runPromiseExit(runnable)).toStrictEqual(
    Exit.fail(
      new NoSuchElementException(`user pool id for ${userPoolName} not found`)
    )
  );
});

test('returns error when client id not returned', async () => {
  const runnable = program.pipe(
    Effect.provide(
      CognitoGatewayLive.pipe(Layer.provide(CognitoClientClientIdFailureTest))
    )
  );

  expect(await Effect.runPromiseExit(runnable)).toStrictEqual(
    Exit.fail(
      new NoSuchElementException(
        `client id for ${userPoolClientName} not found`
      )
    )
  );
});

test('returns error when client secret not returned', async () => {
  const runnable = program.pipe(
    Effect.provide(
      CognitoGatewayLive.pipe(
        Layer.provide(CognitoClientClientSecretFailureTest)
      )
    )
  );

  expect(await Effect.runPromiseExit(runnable)).toStrictEqual(
    Exit.fail(
      new NoSuchElementException(
        `client secret for ${userPoolClientName} not found`
      )
    )
  );
});
