#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { ApiStack } from '../lib/api/api-stack.js';
import { AuthStack } from '../lib/auth/auth-stack.js';
import { DynamoStack } from '../lib/dynamo/dynamo-stack.js';
import { Config } from '../lib/infrastructure/config/config.js';

const app = new cdk.App();
const config = new Config();
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
} satisfies cdk.Environment;

const { productsTable } = new DynamoStack(app, 'EcommerceDynamoStack', {
  env,
});

const { apiUserPool } = new AuthStack(app, 'EcommerceAuthStack', {
  config,
  env,
});

new ApiStack(app, 'EcommerceApiStack', {
  cognitoUserPools: [apiUserPool],
  config,
  env,
  productsTable,
});
