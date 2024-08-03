import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { expect, test } from 'vitest';
import { AuthStack } from '../../../lib/auth/auth-stack.js';
import { Config } from '../../../lib/infrastructure/config/config.js';

const app = new cdk.App();
const config = new Config();
const stack = new AuthStack(app, 'AuthStack', {
  config,
});

const template = Template.fromStack(stack);

test('matches the snapshot', () => {
  expect(template.toJSON()).toMatchSnapshot();
});
