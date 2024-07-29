import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import type * as cognito from 'aws-cdk-lib/aws-cognito';
import type * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import type { Construct } from 'constructs';
import { CognitoAuthorizer } from './auth/cognito-authorizer.js';
import { ProductsResouces } from './products/products-resources.js';

interface ApiStackProps extends cdk.StackProps {
  readonly productsTable: dynamo.ITableV2;
  readonly cognitoUserPools: cognito.IUserPool[];
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new apigw.RestApi(this, 'EcommerceApi');
    const authorizer = new CognitoAuthorizer(this, {
      cognitoUserPools: props.cognitoUserPools,
    });

    new ProductsResouces(this, 'ProductsResources', {
      api,
      authorizer,
      productsTable: props.productsTable,
    });

    cdk.Tags.of(api).add('Name', 'EcommerceApi');
  }
}
