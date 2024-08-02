import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  type GetCommandOutput,
  PutCommand,
  type PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { Context, Effect, Layer } from 'effect';
import type { UnknownException } from 'effect/Cause';

export class DynamoClient extends Context.Tag('DynamoClient')<
  DynamoClient,
  {
    get(
      tableName: string,
      pk: string
    ): Effect.Effect<GetCommandOutput, UnknownException>;
    put(
      tableName: string,
      item: Record<string, string>
    ): Effect.Effect<PutCommandOutput, UnknownException>;
  }
>() {}

export const DynamoClientLive = Layer.sync(DynamoClient, () => {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient());

  return {
    get(tableName: string, pk: string) {
      return Effect.tryPromise(() =>
        client.send(
          new GetCommand({
            Key: {
              PK: pk,
            },
            TableName: tableName,
          })
        )
      );
    },
    put(tableName: string, item: Record<string, string>) {
      return Effect.tryPromise(() =>
        client.send(new PutCommand({ TableName: tableName, Item: item }))
      );
    },
  };
});
