import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { ProductsResouces } from './products/products-resources.js';

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigw.RestApi(this, 'EcommerceApi');

    new ProductsResouces(this, 'ProductsResources', {
      api,
    });
  }
}
