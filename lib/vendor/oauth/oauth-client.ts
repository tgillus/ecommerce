import { Context, Effect, Layer } from 'effect';
import type { UnknownException } from 'effect/Cause';
import { Issuer, TokenSet } from 'openid-client';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class OAuthClient extends Context.Tag('OAuthClient')<
  OAuthClient,
  {
    accessToken(
      issuer: string,
      clientId: string,
      clientSecret: string
    ): Effect.Effect<TokenSet, UnknownException>;
  }
>() {
  static build() {
    return OAuthClientLive;
  }
}

export const OAuthClientLive = Layer.succeed(OAuthClient, {
  accessToken: (issuer: string, clientId: string, clientSecret: string) =>
    Effect.tryPromise(() => Issuer.discover(issuer)).pipe(
      Effect.andThen(
        (issuerService) =>
          new issuerService.Client({
            client_id: clientId,
            client_secret: clientSecret,
          })
      ),
      Effect.andThen((client) =>
        client.grant({
          grant_type: 'client_credentials',
        })
      )
    ),
});

export const OAuthClientSuccessTest = Layer.succeed(OAuthClient, {
  accessToken: (_issuer: string, _clientId: string, _clientSecret: string) =>
    Effect.succeed(
      new TokenSet({
        access_token: 'foo',
      })
    ),
});

export const OAuthClientFailureTest = Layer.succeed(OAuthClient, {
  accessToken: (_issuer: string, _clientId: string, _clientSecret: string) =>
    Effect.succeed(new TokenSet({})),
});
