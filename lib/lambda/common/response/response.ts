import type { APIGatewayProxyResult } from 'aws-lambda';
import type { ResponseDetails } from './response-details.js';

export class Response {
  constructor(private readonly details: ResponseDetails) {}

  produce = (): APIGatewayProxyResult => {
    const { body, statusCode } = this.details;

    return {
      body,
      statusCode,
    };
  };

  static success = () => {
    const details = {
      body: JSON.stringify({ message: 'Success' }),
      statusCode: 200,
    } satisfies ResponseDetails;

    return new Response(details).produce();
  };

  static fail = () => {
    const details = {
      body: JSON.stringify({ message: 'Server error' }),
      statusCode: 500,
    } satisfies ResponseDetails;

    return new Response(details).produce();
  };
}
