import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return {
    body: JSON.stringify({ message: 'Hello from product-api' }),
    statusCode: 200,
  };
};
