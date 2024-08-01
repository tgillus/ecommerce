import { Effect } from 'effect';
import { Issuer } from 'openid-client';

export class Client {
  accessToken(issuer: string, clientId: string, clientSecret: string) {
    return Effect.tryPromise(() => Issuer.discover(issuer)).pipe(
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
    );
  }
}
