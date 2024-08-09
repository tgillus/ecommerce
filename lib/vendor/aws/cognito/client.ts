import {
  CognitoIdentityProviderClient,
  DescribeUserPoolClientCommand,
  type UserPoolClientDescription,
  type UserPoolDescriptionType,
  paginateListUserPoolClients,
  paginateListUserPools,
} from '@aws-sdk/client-cognito-identity-provider';
import { Array as Arr, Effect, Match, Stream } from 'effect';
import { NoSuchElementException, UnknownException } from 'effect/Cause';

export class Client {
  constructor(private readonly client: CognitoIdentityProviderClient) {}

  userPool(userPoolName: string) {
    return this.userPools().pipe(
      Effect.andThen((userPools) =>
        Arr.findFirst(userPools, (userPool) => userPool.Name === userPoolName)
      ),
      Effect.catchTag(
        'NoSuchElementException',
        () =>
          new NoSuchElementException(
            `user pool named ${userPoolName} not found`
          )
      )
    );
  }

  userPoolClient(userPoolId: string, clientName: string) {
    return this.userPoolClients(userPoolId).pipe(
      Effect.andThen((userPoolClients) =>
        Arr.findFirst(
          userPoolClients,
          (userPoolClient) => userPoolClient.ClientName === clientName
        )
      ),
      Effect.catchTag(
        'NoSuchElementException',
        () =>
          new NoSuchElementException(
            `user pool client named ${clientName} in user pool ${userPoolId} not found`
          )
      )
    );
  }

  describePoolClient(clientId: string, userPoolId: string) {
    return Effect.tryPromise(() =>
      this.client.send(
        new DescribeUserPoolClientCommand({
          ClientId: clientId,
          UserPoolId: userPoolId,
        })
      )
    ).pipe(
      Effect.andThen(({ UserPoolClient }) =>
        Effect.fromNullable(UserPoolClient)
      ),
      Effect.catchTag(
        'NoSuchElementException',
        () =>
          new NoSuchElementException(
            `user pool client ${clientId} details in user pool ${userPoolId} not found`
          )
      )
    );
  }

  private userPools() {
    return Stream.fromAsyncIterable(
      paginateListUserPools(
        {
          client: this.client,
        },
        {
          MaxResults: 50,
        }
      ),
      (e) => new UnknownException(e)
    ).pipe(
      Stream.runFold(
        new Array<UserPoolDescriptionType>(),
        (allUserPools, { UserPools }) =>
          Match.value(UserPools).pipe(
            Match.when(Match.undefined, () => allUserPools),
            Match.orElse((userPools) => [...allUserPools, ...userPools])
          )
      )
    );
  }

  private userPoolClients(userPoolId: string) {
    return Stream.fromAsyncIterable(
      paginateListUserPoolClients(
        {
          client: this.client,
        },
        {
          UserPoolId: userPoolId,
          MaxResults: 50,
        }
      ),
      (e) => new UnknownException(e)
    ).pipe(
      Stream.runFold(
        new Array<UserPoolClientDescription>(),
        (allUserPoolClients, { UserPoolClients }) =>
          Match.value(UserPoolClients).pipe(
            Match.when(Match.undefined, () => allUserPoolClients),
            Match.orElse((userPoolClients) => [
              ...allUserPoolClients,
              ...userPoolClients,
            ])
          )
      )
    );
  }

  static build() {
    return new Client(new CognitoIdentityProviderClient());
  }
}
