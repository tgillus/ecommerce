import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { ProductsResouces } from './products/products-resources.js';

interface ApiStackProps extends cdk.StackProps {
  productsTable: dynamo.ITableV2;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new apigw.RestApi(this, 'EcommerceApi');

    new ProductsResouces(this, 'ProductsResources', {
      api,
      productsTable: props.productsTable,
    });
  }
}