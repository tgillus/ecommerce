import { Effect, Exit } from 'effect';
import { NoSuchElementException } from 'effect/Cause';
import * as td from 'testdouble';
import { afterEach, expect, test } from 'vitest';
import { CognitoGateway } from '../../../../lib/infrastructure/cognito/cognito-gateway.js';
import type { Client } from '../../../../lib/vendor/aws/cognito/client.js';

const userPoolName = 'foo';
const userPoolClientName = 'bar';
const client = td.object<Client>();
const cognitoGateway = new CognitoGateway(client);

afterEach(() => {
  td.reset();
});

test('retrieves credentials', async () => {
  const userPoolId = 'baz';
  const clientId = 'qux';
  const clientSecret = 'quux';
  td.when(client.userPool(userPoolName)).thenReturn(
    Effect.succeed({
      Id: userPoolId,
    })
  );
  td.when(client.userPoolClient(userPoolId, userPoolClientName)).thenReturn(
    Effect.succeed({
      ClientId: clientId,
    })
  );
  td.when(client.describePoolClient(clientId, userPoolId)).thenReturn(
    Effect.succeed({
      ClientSecret: clientSecret,
    })
  );
  expect(
    await Effect.runPromise(
      cognitoGateway.credentials(userPoolName, userPoolClientName)
    )
  ).toEqual({
    clientId,
    clientSecret,
    userPoolId,
  });
});

test('returns error when user pool id not returned', async () => {
  td.when(client.userPool(userPoolName)).thenReturn(
    Effect.succeed({
      Id: undefined,
    })
  );
  expect(
    await Effect.runPromiseExit(
      cognitoGateway.credentials(userPoolName, userPoolClientName)
    )
  ).toEqual(
    Exit.fail(
      new NoSuchElementException(`user pool id for ${userPoolName} not found`)
    )
  );
});

test('returns error when client id not returned', async () => {
  const userPoolId = 'baz';
  td.when(client.userPool(userPoolName)).thenReturn(
    Effect.succeed({
      Id: userPoolId,
    })
  );
  td.when(client.userPoolClient(userPoolId, userPoolClientName)).thenReturn(
    Effect.succeed({
      ClientId: undefined,
    })
  );
  expect(
    await Effect.runPromiseExit(
      cognitoGateway.credentials(userPoolName, userPoolClientName)
    )
  ).toEqual(
    Exit.fail(
      new NoSuchElementException(
        `client id for ${userPoolClientName} not found`
      )
    )
  );
});

test('returns error when client secret not returned', async () => {
  const userPoolId = 'baz';
  const clientId = 'qux';
  td.when(client.userPool(userPoolName)).thenReturn(
    Effect.succeed({
      Id: userPoolId,
    })
  );
  td.when(client.userPoolClient(userPoolId, userPoolClientName)).thenReturn(
    Effect.succeed({
      ClientId: clientId,
    })
  );
  td.when(client.describePoolClient(clientId, userPoolId)).thenReturn(
    Effect.succeed({
      ClientSecret: undefined,
    })
  );
  expect(
    await Effect.runPromiseExit(
      cognitoGateway.credentials(userPoolName, userPoolClientName)
    )
  ).toEqual(
    Exit.fail(
      new NoSuchElementException(
        `client secret for ${userPoolClientName} not found`
      )
    )
  );
});

test('builds an cognito gateway', () => {
  expect(CognitoGateway.build()).toBeInstanceOf(CognitoGateway);
});
