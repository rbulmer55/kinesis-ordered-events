import { KinesisStreamHandler, KinesisStreamEvent } from "aws-lambda";

export const handler: KinesisStreamHandler = async ({
  Records,
}: KinesisStreamEvent): Promise<any> => {
  Records.forEach((record, i) => {
    console.log("Full Record: %j", record);
    console.log(
      `Data for ${i}`,
      Buffer.from(record.kinesis.data, "base64").toString()
    );
  });
};
