import { Effect } from 'effect';
import { NoSuchElementException } from 'effect/Cause';
import { Client } from '../../vendor/oauth/client.js';

export class OAuthGateway {
  constructor(private readonly client: Client) {}

  accessToken(clientId: string, clientSecret: string) {
    return this.client.accessToken(clientId, clientSecret).pipe(
      Effect.andThen(({ access_token }) => Effect.fromNullable(access_token)),
      Effect.catchTag(
        'NoSuchElementException',
        () => new NoSuchElementException('no access token available')
      )
    );
  }

  static build() {
    return new OAuthGateway(Client.build());
  }
}
