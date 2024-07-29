import { Effect } from 'effect';
import { Issuer } from 'openid-client';

export class Client {
  constructor(private readonly issuer: Issuer) {}

  accessToken(clientId: string, clientSecret: string) {
    const client = new this.issuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
    });

    return Effect.tryPromise(() =>
      client.grant({
        grant_type: 'client_credentials',
      })
    );
  }

  static build() {
    return new Client(
      new Issuer({
        issuer: 'AWS Cognito',
        token_endpoint:
          'https://ecommerce-api.auth.us-east-1.amazoncognito.com/oauth2/token',
      })
    );
  }
}
