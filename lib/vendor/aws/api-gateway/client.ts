import {
  APIGatewayClient,
  type RestApi,
  paginateGetRestApis,
} from '@aws-sdk/client-api-gateway';
import { Array as Arr, Effect, Match, Stream } from 'effect';
import { NoSuchElementException, UnknownException } from 'effect/Cause';

export class Client {
  constructor(private readonly client: APIGatewayClient) {}

  restApi(restApiName: string) {
    return this.restApis().pipe(
      Effect.andThen((restApis) =>
        Arr.findFirst(restApis, ({ tags }) =>
          Match.value(tags).pipe(
            Match.when(Match.undefined, () => false),
            Match.orElse((tags) => tags.Name === restApiName)
          )
        )
      ),
      Effect.catchTag(
        'NoSuchElementException',
        () =>
          new NoSuchElementException(`rest api named ${restApiName} not found`)
      )
    );
  }

  private restApis() {
    return Stream.fromAsyncIterable(
      paginateGetRestApis(
        {
          client: this.client,
        },
        {}
      ),
      (e) => new UnknownException(e)
    ).pipe(
      Stream.runFold([] as RestApi[], (allRestApis, { items }) =>
        Match.value(items).pipe(
          Match.when(Match.undefined, () => allRestApis),
          Match.orElse((restApis) => [...allRestApis, ...restApis])
        )
      )
    );
  }

  static build() {
    return new Client(new APIGatewayClient());
  }
}
