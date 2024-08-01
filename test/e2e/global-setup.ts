import 'dotenv/config';
import { Effect } from 'effect';
import type { GlobalSetupContext } from 'vitest/node';
import { CognitoGateway } from '../../lib/infrastructure/cognito/cognito-gateway.js';
import { Config } from '../../lib/infrastructure/config/config.js';
import { OAuthGateway } from '../../lib/infrastructure/oauth/oauth-gateway.js';

export default async function setup({ provide }: GlobalSetupContext) {
  const {
    settings: {
      aws: {
        cognito: { issuerHostname, testUserPoolClientName, userPoolName },
      },
    },
  } = new Config();
  const cogGateway = CognitoGateway.build();
  const oauthGateway = OAuthGateway.build();
  const accessToken = await Effect.runPromise(
    cogGateway
      .credentials(userPoolName, testUserPoolClientName)
      .pipe(
        Effect.andThen(({ clientId, clientSecret, userPoolId }) =>
          oauthGateway.accessToken(
            `https://${issuerHostname}/${userPoolId}`,
            clientId,
            clientSecret
          )
        )
      )
  );

  provide('accessToken', accessToken);
}

declare module 'vitest' {
  export interface ProvidedContext {
    accessToken: string;
  }
}
