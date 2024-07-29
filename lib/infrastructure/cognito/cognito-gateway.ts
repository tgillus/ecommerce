import { Effect } from 'effect';
import { NoSuchElementException } from 'effect/Cause';
import { Client } from '../../vendor/aws/cognito/client.js';

export class CognitoGateway {
  private readonly userPoolName = 'EcommerceApi';
  private readonly clientName = 'Test';

  constructor(private readonly client: Client) {}

  credentials() {
    return Effect.Do.pipe(
      Effect.bind('userPool', () => this.client.userPool(this.userPoolName)),
      Effect.bind('userPoolId', ({ userPool: { Id } }) =>
        Effect.fromNullable(Id)
      ),
      Effect.catchTag(
        'NoSuchElementException',
        () =>
          new NoSuchElementException(
            `user pool id for ${this.userPoolName} not found`
          )
      ),
      Effect.bind('userPoolClient', ({ userPoolId }) =>
        this.client.userPoolClient(userPoolId, this.clientName)
      ),
      Effect.bind('clientId', ({ userPoolClient: { ClientId } }) =>
        Effect.fromNullable(ClientId)
      ),
      Effect.catchTag(
        'NoSuchElementException',
        () =>
          new NoSuchElementException(
            `client id for ${this.clientName} not found`
          )
      ),
      Effect.bind('userPoolClientDetails', ({ clientId, userPoolId }) =>
        this.client.describePoolClient(clientId, userPoolId)
      ),
      Effect.bind(
        'clientSecret',
        ({ userPoolClientDetails: { ClientSecret } }) =>
          Effect.fromNullable(ClientSecret)
      ),
      Effect.catchTag(
        'NoSuchElementException',
        () =>
          new NoSuchElementException(
            `client secret for ${this.clientName} not found`
          )
      ),
      Effect.andThen(({ clientId, clientSecret }) => ({
        clientId,
        clientSecret,
      }))
    );
  }

  static build() {
    return new CognitoGateway(Client.build());
  }
}
