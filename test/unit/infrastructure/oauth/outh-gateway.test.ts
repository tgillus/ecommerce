import { Effect, Layer } from 'effect';
import * as td from 'testdouble';
import { afterEach, beforeEach, expect, test } from 'vitest';
import {
  OAuthGateway,
  OAuthGatewayLive,
} from '../../../../lib/infrastructure/oauth/oauth-gateway.js';
import {
  OAuthClient,
  OAuthClientSuccessTest,
} from '../../../../lib/vendor/oauth/oauth-client.js';

const issuer = 'foo';
const clientId = 'bar';
const clientSecret = 'baz';

const program = Effect.gen(function* () {
  const oauthGateway = yield* OAuthGateway;
  return yield* oauthGateway.accessToken(issuer, clientId, clientSecret);
});

beforeEach(() => {
  td.replace(OAuthClient, 'build');
});

afterEach(() => {
  td.reset();
});

test('builds an oauth gateway', async () => {
  td.when(OAuthClient.build()).thenReturn(OAuthClientSuccessTest);
  const oauthGateway = OAuthGateway.build();

  expect(
    await Effect.runPromise(program.pipe(Effect.provide(oauthGateway)))
  ).toStrictEqual('foo');
});

test('retrieves an access token', async () => {
  const oauthGateway = OAuthGatewayLive.pipe(
    Layer.provide(OAuthClientSuccessTest)
  );

  expect(
    await Effect.runPromise(program.pipe(Effect.provide(oauthGateway)))
  ).toStrictEqual('foo');
});
