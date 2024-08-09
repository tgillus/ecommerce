import { Context, Effect, Layer } from 'effect';
import { NoSuchElementException, type UnknownException } from 'effect/Cause';
import { OAuthClient } from '../../vendor/oauth/oauth-client.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class OAuthGateway extends Context.Tag('OAuthGateway')<
  OAuthGateway,
  {
    accessToken(
      issuer: string,
      clientId: string,
      clientSecret: string
    ): Effect.Effect<string, UnknownException | NoSuchElementException>;
  }
>() {
  static build() {
    return OAuthGatewayLive.pipe(Layer.provide(OAuthClient.build()));
  }
}

export const OAuthGatewayLive = Layer.effect(
  OAuthGateway,
  Effect.gen(function* () {
    const client = yield* OAuthClient;

    return {
      accessToken: (issuer: string, clientId: string, clientSecret: string) =>
        client.accessToken(issuer, clientId, clientSecret).pipe(
          Effect.andThen(({ access_token }) =>
            Effect.fromNullable(access_token)
          ),
          Effect.catchTag(
            'NoSuchElementException',
            () => new NoSuchElementException('no access token available')
          )
        ),
    };
  })
);
