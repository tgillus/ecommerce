import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  SelectObjectContentCommand,
  SelectObjectContentCommandInput,
  SelectObjectContentCommandOutput,
  SelectObjectContentEventStream,
} from '@aws-sdk/client-s3';
import {
  Chunk,
  Effect,
  Either,
  Match,
  Option,
  Sink,
  Stream,
  pipe,
} from 'effect';

export class Client {
  private readonly client = new S3Client();

  get = (params: GetObjectCommandInput) =>
    Effect.tryPromise(() => this.client.send(new GetObjectCommand(params)));

  put = (params: PutObjectCommandInput) =>
    Effect.tryPromise(() => this.client.send(new PutObjectCommand(params)));

  select = (params: SelectObjectContentCommandInput) =>
    Effect.tryPromise(() =>
      this.client.send(new SelectObjectContentCommand(params))
    ).pipe(Effect.flatMap(this.selectOutput));

  private selectOutput = ({
    $metadata: { httpStatusCode },
    Payload,
  }: SelectObjectContentCommandOutput) =>
    Match.value(httpStatusCode).pipe(
      Match.when(200, () =>
        pipe(
          Option.fromNullable(Payload),
          Either.fromOption(() => new Error('Payload not found')),
          Effect.flatMap(this.selectOutputPayload)
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

  private selectOutputPayload = (
    payload: AsyncIterable<SelectObjectContentEventStream>
  ) =>
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
        Effect.map((chunks) =>
          Buffer.concat(chunks.pipe(Chunk.toReadonlyArray)).toString('utf8')
        )
      );
    });
}
