import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { expect, test } from 'vitest';
import { ApiStack } from '../../../lib/api/api-stack.js';
import { AuthStack } from '../../../lib/auth/auth-stack.js';
import { DynamoStack } from '../../../lib/dynamo/dynamo-stack.js';
import { Config } from '../../../lib/infrastructure/config/config.js';

const app = new cdk.App();
const config = new Config();
const { productsTable } = new DynamoStack(app, 'DynamoStack');
const { apiUserPool } = new AuthStack(app, 'AuthStack', {
  config,
});
const stack = new ApiStack(app, 'ApiStack', {
  cognitoUserPools: [apiUserPool],
  config,
  productsTable,
});

const template = Template.fromStack(stack);

test('matches the snapshot', () => {
  expect(template.toJSON()).toMatchSnapshot();
});
