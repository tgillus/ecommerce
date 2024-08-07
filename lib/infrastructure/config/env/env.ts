import 'dotenv/config';
import { cleanEnv, host, str } from 'envalid';

export const env = cleanEnv(process.env, {
  API_NAME: str(),
  AWS_API_GATEWAY_REGION: str(),
  AWS_COGNITO_DOMAIN_PREFIX: str(),
  AWS_COGNITO_ISSUER_HOSTNAME: host(),
  AWS_COGNITO_RESOURCE_SERVER_IDENTIFIER: str(),
  AWS_COGNITO_TEST_USER_POOL_CLIENT_NAME: str(),
  AWS_COGNITO_USER_POOL_NAME: str(),
  CDK_DEFAULT_ACCOUNT: str({
    devDefault: 'foo',
  }),
  CDK_DEFAULT_REGION: str({
    devDefault: 'us-east-1',
  }),
});
