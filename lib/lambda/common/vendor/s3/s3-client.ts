import {
  GetObjectCommand,
  type GetObjectCommandInput,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
  SelectObjectContentCommand,
  type SelectObjectContentCommandInput,
  type SelectObjectContentCommandOutput,
  type SelectObjectContentEventStream,
} from '@aws-sdk/client-s3';
import { Chunk, Effect, Either, Match, Option, Sink, Stream } from 'effect';

export class Client {
  private readonly client = new S3Client();

  get(params: GetObjectCommandInput) {
    return Effect.tryPromise(() =>
      this.client.send(new GetObjectCommand(params))
    );
  }

  put(params: PutObjectCommandInput) {
    return Effect.tryPromise(() =>
      this.client.send(new PutObjectCommand(params))
    );
  }

  select(params: SelectObjectContentCommandInput) {
    return Effect.tryPromise(() =>
      this.client.send(new SelectObjectContentCommand(params))
    ).pipe(Effect.andThen(this.selectOutput));
  }

  private selectOutput({
    $metadata: { httpStatusCode },
    Payload,
  }: SelectObjectContentCommandOutput) {
    return Match.value(httpStatusCode).pipe(
      Match.when(200, () =>
        Option.fromNullable(Payload).pipe(
          Either.fromOption(() => new Error('Payload not found')),
          Effect.andThen(this.selectOutputPayload)
        )
      ),
      Match.orElse(() =>
        Effect.fail(
          new Error(
            `SelectObjectContentCommand failed with status code of ${httpStatusCode}`
          )
        )
      )
    );
  }

  private selectOutputPayload(
    payload: AsyncIterable<SelectObjectContentEventStream>
  ) {
    Effect.tryPromise(async () => {
      const stream = Stream.fromAsyncIterable(
        payload,
        () => new Error('Failed processing stream')
      );

      return stream.pipe(
        Stream.run(
          Sink.foldLeft(Chunk.make(new Uint8Array()), (chunks, chunk) =>
            Option.fromNullable(chunk.Records).pipe(
              Option.flatMapNullable(({ Payload }) => Payload),
              Option.match({
                onNone: () => chunks,
                onSome: (chunk) => chunks.pipe(Chunk.append(chunk)),
              })
            )
          )
        ),
        Effect.andThen((chunks) =>
          Buffer.concat(chunks.pipe(Chunk.toReadonlyArray)).toString('utf8')
        )
      );
    });
  }
}
