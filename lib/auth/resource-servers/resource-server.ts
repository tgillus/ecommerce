import * as cognito from 'aws-cdk-lib/aws-cognito';
import { ReadScope } from './scopes/read-scope.js';
import { WriteScope } from './scopes/write-scope.js';

interface ResourceServerProps {
  readonly pool: cognito.IUserPool;
}

export class ResourceServer {
  readonly readScope: cognito.OAuthScope;
  readonly writeScope: cognito.OAuthScope;

  constructor({ pool }: ResourceServerProps) {
    const readScope = new ReadScope();
    const writeScope = new WriteScope();
    const resourceServer = new cognito.UserPoolResourceServer(
      pool,
      'EcommerceApiResourceServer',
      {
        identifier: 'EcommerceApiResourceService',
        userPool: pool,
        scopes: [readScope, writeScope],
      }
    );

    this.readScope = cognito.OAuthScope.resourceServer(
      resourceServer,
      readScope
    );
    this.writeScope = cognito.OAuthScope.resourceServer(
      resourceServer,
      writeScope
    );
  }
}
