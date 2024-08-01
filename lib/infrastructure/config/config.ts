import { env } from './env/env.js';

interface Settings {
  readonly api: ApiSettings;
  readonly aws: AwsSettings;
}

interface ApiSettings {
  readonly name: string;
}

interface AwsSettings {
  readonly apiGateway: ApiGatewaySettings;
  readonly cognito: CognitoSettings;
}

interface ApiGatewaySettings {
  readonly region: string;
}

interface CognitoSettings {
  readonly domainPrefix: string;
  readonly issuerHostname: string;
  readonly resourceServerIdentifier: string;
  readonly testUserPoolClientName: string;
  readonly userPoolName: string;
}

export class Config {
  readonly settings: Settings;

  constructor() {
    this.settings = {
      api: {
        name: env.API_NAME,
      },
      aws: {
        apiGateway: {
          region: env.AWS_API_GATEWAY_REGION,
        },
        cognito: {
          domainPrefix: env.AWS_COGNITO_DOMAIN_PREFIX,
          issuerHostname: env.AWS_COGNITO_ISSUER_HOSTNAME,
          resourceServerIdentifier: env.AWS_COGNITO_RESOURCE_SERVER_IDENTIFIER,
          testUserPoolClientName: env.AWS_COGNITO_TEST_USER_POOL_CLIENT_NAME,
          userPoolName: env.AWS_COGNITO_USER_POOL_NAME,
        },
      },
    };
  }
}
