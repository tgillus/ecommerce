#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { DynamoStack } from '../lib/dynamo/dynamo-stack.js';

const app = new cdk.App();

new DynamoStack(app, 'ECommerceDynamoStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
