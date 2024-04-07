import { APIGatewayProxyResult } from 'aws-lambda';
import { Exit } from 'effect';
import { ResponseDetails } from './response-details.js';

export class Response {
  constructor(private readonly details: ResponseDetails) {}

  produce = (): APIGatewayProxyResult => {
    const { body, statusCode } = this.details;

    return {
      body,
      statusCode,
    };
  };

  static produce = (result: Exit.Exit<void, Error>) => {
    const details = Exit.match(result, {
      onFailure: () => ({
        body: JSON.stringify({ message: 'Server error' }),
        statusCode: 500,
      }),
      onSuccess: () => ({
        body: JSON.stringify({ message: 'Success' }),
        statusCode: 200,
      }),
    }) satisfies ResponseDetails;

    return new Response(details).produce();
  };
}
