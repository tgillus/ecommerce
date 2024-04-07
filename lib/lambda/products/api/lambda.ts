import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RequestParams } from '../../common/request/request-params.js';
import { Api } from './api.js';

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const params = new RequestParams(event);
  const api = Api.from(params);

  return await api.handler(params);
};
