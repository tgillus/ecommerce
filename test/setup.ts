import 'dotenv/config';
import { request } from 'pactum';

request.setBaseUrl(
  `https://${process.env.AWS_API_GATEWAY_ID}.execute-api.${process.env.AWS_API_GATEWAY_REGION}.amazonaws.com/prod`
);
