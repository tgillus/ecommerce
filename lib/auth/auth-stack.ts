import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import type { Construct } from 'constructs';

export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const pool = new cognito.UserPool(this, 'EcommerceApi', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const ecommerceApiReadScope = new cognito.ResourceServerScope({
      scopeName: 'ecommerceapi.read',
      scopeDescription: 'Ecommerce API read scope',
    });

    const resourceServer = new cognito.UserPoolResourceServer(
      this,
      'EcommerceApiResourceService',
      {
        identifier: 'EcommerceApiResourceService',
        userPool: pool,
        scopes: [ecommerceApiReadScope],
      }
    );

    pool.addClient('IntegrationTesting', {
      accessTokenValidity: cdk.Duration.hours(1),
      enableTokenRevocation: true,
      generateSecret: true,
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        scopes: [
          cognito.OAuthScope.resourceServer(
            resourceServer,
            ecommerceApiReadScope
          ),
        ],
      },
      refreshTokenValidity: cdk.Duration.days(1),
      userPoolClientName: 'IntegrationTesting',
    });

    pool.addDomain('EcommerceApiDomain', {
      cognitoDomain: {
        domainPrefix: 'ecommerce-api',
      },
    });
  }
}
