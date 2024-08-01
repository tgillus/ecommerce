import { Effect } from 'effect';
import { NoSuchElementException } from 'effect/Cause';
import { Client } from '../../vendor/aws/api-gateway/client.js';

export class ApiGateway {
  constructor(private readonly client: Client) {}

  apiId(apiName: string) {
    return this.client
      .restApi(apiName)
      .pipe(
        Effect.andThen(({ id }) =>
          Effect.fromNullable(id).pipe(
            Effect.catchTag(
              'NoSuchElementException',
              () =>
                new NoSuchElementException(
                  `api named ${apiName} found but does not have an id`
                )
            )
          )
        )
      );
  }

  static build() {
    return new ApiGateway(Client.build());
  }
}
