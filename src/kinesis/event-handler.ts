import { KinesisStreamHandler, KinesisStreamEvent } from "aws-lambda";
import { SQS } from "aws-sdk";

const {
  env: { QUEUE_URL = "" },
} = process;

const sqs = new SQS({ region: "eu-west-1" });

export const handler: KinesisStreamHandler = async ({
  Records,
}: KinesisStreamEvent): Promise<any> => {
  for (const [i, record] of Records.entries()) {
    console.log("Full Record: %j", record);
    // kinesis stores string data as base64
    const decodedData = Buffer.from(record.kinesis.data, "base64").toString();
    console.log(`Data for ${i}`, decodedData);
    // pass data to a fifo queue for guarenteed order processing
    await sqs
      .sendMessage({ MessageBody: decodedData, QueueUrl: QUEUE_URL })
      .promise();

    console.log(`Data ${i} sent to consumer`);
  }
};
