import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import type { Construct } from 'constructs';
import { TestPoolClient } from '../clients/test-pool-client.js';
import { ResourceServer } from '../resource-servers/resource-server.js';
import { PoolDomain } from './domains/pool-domain.js';

export class ApiPool extends cognito.UserPool {
  constructor(scope: Construct) {
    super(scope, 'EcommerceApiPool', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const { readScope, writeScope } = new ResourceServer({
      pool: this,
    });

    new PoolDomain({ pool: this });

    new TestPoolClient({
      pool: this,
      scopes: [readScope, writeScope],
    });
  }
}
