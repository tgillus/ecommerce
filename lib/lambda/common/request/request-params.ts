import type { APIGatewayEvent } from 'aws-lambda';
import { Option } from 'effect';

export class RequestParams {
  constructor(private readonly event: Event) {}

  get body() {
    return Option.fromNullable(this.event.body).pipe(
      Option.getOrElse(() => '')
    );
  }

  get httpMethod() {
    return this.event.httpMethod.toUpperCase();
  }

  get parameters() {
    return {
      ...this.event.pathParameters,
    };
  }
}

type Event = Pick<APIGatewayEvent, 'body' | 'httpMethod' | 'pathParameters'>;
