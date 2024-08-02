import type { APIGatewayEvent } from 'aws-lambda';
import { Option } from 'effect';

export class RequestParams {
  constructor(private readonly event: Event) {}

  get body() {
    return Option.getOrElse(Option.fromNullable(this.event.body), () => '');
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
