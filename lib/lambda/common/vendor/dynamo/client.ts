import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Effect, pipe } from 'effect';

export class Client {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  put = (tableName: string, item: Record<string, unknown>) =>
    pipe(
      Effect.tryPromise(() =>
        this.client.send(new PutCommand({ TableName: tableName, Item: item }))
      )
    );
}
