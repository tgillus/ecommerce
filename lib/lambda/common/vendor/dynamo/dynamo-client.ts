import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { Context, Effect, Layer } from 'effect';
import { UnknownException } from 'effect/Cause';

export class DynamoClient extends Context.Tag('DynamoClient')<
  DynamoClient,
  {
    put: (
      tableName: string,
      item: Record<string, string>
    ) => Effect.Effect<PutCommandOutput, UnknownException, never>;
  }
>() {}

export const DynamoClientLive = Layer.succeed(
  DynamoClient,
  DynamoClient.of({
    put: (tableName: string, item: Record<string, string>) => {
      const client = DynamoDBDocumentClient.from(new DynamoDBClient());

      return Effect.tryPromise(() =>
        client.send(new PutCommand({ TableName: tableName, Item: item }))
      );
    },
  })
);
