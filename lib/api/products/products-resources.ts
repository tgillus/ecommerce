import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Package } from '../../vendor/pkg/package.js';

interface ProductsResourcesProps {
  api: apigw.IRestApi;
}

export class ProductsResouces extends Construct {
  constructor(scope: Construct, id: string, { api }: ProductsResourcesProps) {
    super(scope, id);

    const integration = new apigw.LambdaIntegration(
      new nodejs.NodejsFunction(this, 'ApiHandler', {
        entry: `${Package.rootDir()}/lib/lambda/products/api/lambda.ts`,
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_20_X,
      })
    );

    const products = api.root.addResource('products');
    products.addMethod('POST', integration);

    const product = products.addResource('{productId}');
    product.addMethod('GET', integration);
  }
}
