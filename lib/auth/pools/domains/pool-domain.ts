import * as cognito from 'aws-cdk-lib/aws-cognito';

interface PoolDomainProps {
  readonly pool: cognito.IUserPool;
}

export class PoolDomain extends cognito.UserPoolDomain {
  constructor({ pool }: PoolDomainProps) {
    super(pool, 'EcommerceApiDomain', {
      userPool: pool,
      cognitoDomain: {
        domainPrefix: 'ecommerce-api',
      },
    });
  }
}
