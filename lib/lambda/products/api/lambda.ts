import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RequestParams } from '../../common/request/request-params.js';

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const params = new RequestParams(event);

  return {
    body: JSON.stringify({ message: 'Hello from product-api' }),
    statusCode: 200,
  };
};
