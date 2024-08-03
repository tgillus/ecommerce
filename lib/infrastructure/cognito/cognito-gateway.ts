import { Effect } from 'effect';
import { NoSuchElementException } from 'effect/Cause';
import { Client } from '../../vendor/aws/cognito/client.js';

export class CognitoGateway {
  constructor(private readonly client: Client) {}

  credentials(userPoolName: string, userPoolClientName: string) {
    return Effect.Do.pipe(
      Effect.bind('userPool', () => this.client.userPool(userPoolName)),
      Effect.bind('userPoolId', ({ userPool: { Id } }) =>
        Effect.fromNullable(Id)
      ),
      Effect.catchTag(
        'NoSuchElementException',
        () =>
          new NoSuchElementException(
            `user pool id for ${userPoolName} not found`
          )
      ),
      Effect.bind('userPoolClient', ({ userPoolId }) =>
        this.client.userPoolClient(userPoolId, userPoolClientName)
      ),
      Effect.bind('clientId', ({ userPoolClient: { ClientId } }) =>
        Effect.fromNullable(ClientId).pipe(
          Effect.catchTag('NoSuchElementException', () =>
            Effect.fail(
              new NoSuchElementException(
                `client id for ${userPoolClientName} not found`
              )
            )
          )
        )
      ),
      Effect.bind('userPoolClientDetails', ({ clientId, userPoolId }) =>
        this.client.describePoolClient(clientId, userPoolId)
      ),
      Effect.bind(
        'clientSecret',
        ({ userPoolClientDetails: { ClientSecret } }) =>
          Effect.fromNullable(ClientSecret).pipe(
            Effect.catchTag(
              'NoSuchElementException',
              () =>
                new NoSuchElementException(
                  `client secret for ${userPoolClientName} not found`
                )
            )
          )
      ),
      Effect.andThen(({ clientId, clientSecret, userPoolId }) => ({
        clientId,
        clientSecret,
        userPoolId,
      }))
    );
  }

  static build() {
    return new CognitoGateway(Client.build());
  }
}
