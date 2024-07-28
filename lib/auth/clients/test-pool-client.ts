import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';

interface TestPoolClientProps {
  readonly pool: cognito.IUserPool;
  readonly scopes: cognito.OAuthScope[];
}

export class TestPoolClient extends cognito.UserPoolClient {
  constructor({ pool, scopes }: TestPoolClientProps) {
    super(pool, 'TestPoolClient', {
      accessTokenValidity: cdk.Duration.hours(1),
      enableTokenRevocation: true,
      generateSecret: true,
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        scopes,
      },
      refreshTokenValidity: cdk.Duration.days(1),
      userPool: pool,
      userPoolClientName: 'Test',
    });
  }
}
