import * as cdk from 'aws-cdk-lib';
import type * as cognito from 'aws-cdk-lib/aws-cognito';
import type { Construct } from 'constructs';
import { ApiUserPool } from './pools/api-user-pool.js';

export class AuthStack extends cdk.Stack {
  readonly apiUserPool: cognito.IUserPool;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.apiUserPool = new ApiUserPool(this);
  }
}
