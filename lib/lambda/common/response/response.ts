import type { APIGatewayProxyResult } from 'aws-lambda';
import type { ResponseDetails } from './response-details.js';

export class Response {
  constructor(private readonly details: ResponseDetails) {}

  private produce(): APIGatewayProxyResult {
    const { body, statusCode } = this.details;

    return {
      body,
      statusCode,
    };
  }

  static ok(data: Record<string, unknown>) {
    const details = {
      body: JSON.stringify({ message: 'OK', ...data }),
      statusCode: 200,
    } satisfies ResponseDetails;

    return new Response(details).produce();
  }

  static badRequest(data: Record<string, unknown>) {
    const details = {
      body: JSON.stringify({ message: 'Bad Request', ...data }),
      statusCode: 400,
    } satisfies ResponseDetails;

    return new Response(details).produce();
  }

  static notFound() {
    const details = {
      body: JSON.stringify({ message: 'Not Found' }),
      statusCode: 404,
    } satisfies ResponseDetails;

    return new Response(details).produce();
  }

  static serverError() {
    const details = {
      body: JSON.stringify({ message: 'Internal Server Error' }),
      statusCode: 500,
    } satisfies ResponseDetails;

    return new Response(details).produce();
  }
}
