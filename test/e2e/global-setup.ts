import 'dotenv/config';
import { Effect } from 'effect';
import type { GlobalSetupContext } from 'vitest/node';
import { CognitoGateway } from '../../lib/infrastructure/cognito/cognito-gateway.js';
import { OAuthGateway } from '../../lib/infrastructure/oauth/oauth-gateway.js';

export default async function setup({ provide }: GlobalSetupContext) {
  const cogGateway = CognitoGateway.build();
  const oauthGateway = OAuthGateway.build();
  const accessToken = await Effect.runPromise(
    cogGateway
      .credentials()
      .pipe(
        Effect.andThen(({ clientId, clientSecret }) =>
          oauthGateway.accessToken(clientId, clientSecret)
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
