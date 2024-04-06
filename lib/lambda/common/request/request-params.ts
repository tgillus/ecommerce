import { APIGatewayEvent } from 'aws-lambda';

export class RequestParams {
  constructor(private readonly event: Event) {}

  get body() {
    return this.event.body ?? '';
  }

  get httpMethod() {
    return this.event.httpMethod;
  }
}

type Event = Pick<APIGatewayEvent, 'body' | 'httpMethod'>;
