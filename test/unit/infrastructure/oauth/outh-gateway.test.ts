import { Effect, Exit } from 'effect';
import { NoSuchElementException } from 'effect/Cause';
import { TokenSet } from 'openid-client';
import * as td from 'testdouble';
import { expect, test } from 'vitest';
import { OAuthGateway } from '../../../../lib/infrastructure/oauth/oauth-gateway.js';
import type { Client } from '../../../../lib/vendor/oauth/client.js';

const issuer = 'foo';
const clientId = 'bar';
const clientSecret = 'baz';
const accessToken = 'qux';
const client = td.object<Client>();
const oauthGateway = new OAuthGateway(client);

test('retrieves an api id', async () => {
  td.when(client.accessToken(issuer, clientId, clientSecret)).thenReturn(
    Effect.succeed(
      new TokenSet({
        access_token: accessToken,
      })
    )
  );

  expect(
    await Effect.runPromise(
      oauthGateway.accessToken(issuer, clientId, clientSecret)
    )
  ).toEqual(accessToken);
});

test('returns error when no access token is provided', async () => {
  td.when(client.accessToken(issuer, clientId, clientSecret)).thenReturn(
    Effect.succeed(new TokenSet({}))
  );

  expect(
    await Effect.runPromiseExit(
      oauthGateway.accessToken(issuer, clientId, clientSecret)
    )
  ).toEqual(Exit.fail(new NoSuchElementException('no access token available')));
});

test('builds an outh gateway', () => {
  expect(OAuthGateway.build()).toBeInstanceOf(OAuthGateway);
});
