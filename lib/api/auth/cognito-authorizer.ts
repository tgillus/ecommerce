import type * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import type * as cognito from 'aws-cdk-lib/aws-cognito';
import type { Construct } from 'constructs';

interface CognitoAuthorizerProps extends cdk.StackProps {
  readonly cognitoUserPools: cognito.IUserPool[];
}

export class CognitoAuthorizer extends apigw.CognitoUserPoolsAuthorizer {
  constructor(scope: Construct, { cognitoUserPools }: CognitoAuthorizerProps) {
    super(scope, 'CognitoAuthorizer', {
      cognitoUserPools,
    });
  }
}
