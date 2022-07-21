import { Stack, StackProps } from "aws-cdk-lib";
import { KinesisFirehoseStream } from "aws-cdk-lib/aws-events-targets";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { CfnDeliveryStream } from "aws-cdk-lib/aws-kinesisfirehose";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class KinesisOrderedEventsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'KinesisOrderedEventsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const firehoseRole = new Role(this, "myKinesisFirehoseRole", {
      assumedBy: new ServicePrincipal("firehose.amazonaws.com"),
    });

    const deliveryBucket = new Bucket(this, "myDeliveryBucket", {
      bucketName: "rb-koe-delivery-bucket",
    });

    new CfnDeliveryStream(this, "myDeliveryStream", {
      s3DestinationConfiguration: {
        bucketArn: deliveryBucket.bucketArn,
        roleArn: firehoseRole.roleArn,
      },
    });
  }
}
