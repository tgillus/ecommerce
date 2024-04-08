import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Package } from '../vendor/pkg/package.js';

export class ApiStack extends cdk.Stack {
  private readonly pkg = Package.build();

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new nodejs.NodejsFunction(this, 'ProductsApiHandler', {
      entry: `${this.pkg.rootDir()}/lib/lambda/products/api/lambda.ts`,
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
    });
    const integration = new apigw.LambdaIntegration(handler);

    const api = new apigw.RestApi(this, 'EcommerceApi');

    const products = api.root.addResource('products');
    products.addMethod('POST', integration);

    const product = products.addResource('{productId}');
    product.addMethod('GET', integration);
  }
}
