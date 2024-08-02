import type { APIGatewayProxyResult } from 'aws-lambda';
import type { ResponseDetails } from './response-details.js';

export class Response {
  constructor(private readonly details: ResponseDetails) {}

  produce() {
    const { body, statusCode } = this.details;

    return {
      body,
      statusCode,
    } satisfies APIGatewayProxyResult;
  }

  static success(data: Record<string, unknown>) {
    const details = {
      body: JSON.stringify({ message: 'Success', ...data }),
      statusCode: 200,
    } satisfies ResponseDetails;

    return new Response(details).produce();
  }

  static notFound() {
    const details = {
      body: JSON.stringify({ message: 'Not found' }),
      statusCode: 404,
    } satisfies ResponseDetails;

    return new Response(details).produce();
  }

  static fail() {
    const details = {
      body: JSON.stringify({ message: 'Server error' }),
      statusCode: 500,
    } satisfies ResponseDetails;

    return new Response(details).produce();
  }
}
