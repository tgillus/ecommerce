import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { test } from 'vitest';
import { DynamoStack } from '../../../lib/dynamo/dynamo-stack.js';

const app = new cdk.App();
const stack = new DynamoStack(app, 'ECommerceDynamoStack');
const template = Template.fromStack(stack);

test('creates global tables', () => {
  template.resourceCountIs('AWS::DynamoDB::GlobalTable', 1);
});
