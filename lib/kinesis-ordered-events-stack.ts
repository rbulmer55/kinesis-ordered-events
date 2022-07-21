import { Stream } from "aws-cdk-lib/aws-kinesis";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { Runtime, StartingPosition } from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";

export class KinesisOrderedEventsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myOrderedStream = new Stream(this, "MyOrderedStream", {
      streamName: "my-ordered-stream",
      shardCount: 1,
      retentionPeriod: Duration.hours(48),
    });

    const eventHandlerLambda: lambda.NodejsFunction = new lambda.NodejsFunction(
      this,
      "Function",
      {
        functionName: "KinesisMessageHandler",
        runtime: Runtime.NODEJS_16_X,
        entry: join(__dirname, "../src/kinesis/event-handler.ts"),
        memorySize: 512,
        handler: "handler",
        environment: {},
        bundling: {
          minify: true,
          externalModules: ["aws-sdk"],
        },
      }
    );

    const eventSource = new lambdaEventSources.KinesisEventSource(
      myOrderedStream,
      {
        startingPosition: StartingPosition.TRIM_HORIZON,
        maxBatchingWindow: Duration.seconds(10),
        batchSize: 100,
      }
    );

    eventHandlerLambda.addEventSource(eventSource);
  }
}
