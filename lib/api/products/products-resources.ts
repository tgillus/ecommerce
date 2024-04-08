import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Package } from '../../vendor/pkg/package.js';

interface ProductsResourcesProps {
  api: apigw.IRestApi;
  productsTable: dynamo.ITableV2;
}

export class ProductsResouces extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { api, productsTable }: ProductsResourcesProps
  ) {
    super(scope, id);

    const handler = new nodejs.NodejsFunction(this, 'ApiHandler', {
      entry: `${Package.rootDir()}/lib/lambda/products/api/lambda.ts`,
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
      },
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
    });
    const integration = new apigw.LambdaIntegration(handler);

    const products = api.root.addResource('products');
    products.addMethod('POST', integration);

    const product = products.addResource('{productId}');
    product.addMethod('GET', integration);

    productsTable.grantReadWriteData(handler);
  }
}
