const sdk = require("aws-sdk");
const events = [
  { id: "1", msg: "test-1" },
  { id: "2", msg: "test-2" },
  { id: "3", msg: "test-3" },
  { id: "4", msg: "test-4" },
  { id: "5", msg: "test-5" },
];
const kinesis = new sdk.Kinesis({ region: "eu-west-1" });
(async () => {
  console.log("hello world");
  for (const { id, msg } of events) {
    console.log(`processing event: ${id}`);
    await kinesis
      .putRecord({
        Data: Buffer.from(JSON.stringify({ id, msg })),
        PartitionKey: "1234",
        StreamName: "my-ordered-stream",
        //SequenceNumberForOrdering: id, // by default in order they arrive
      })
      .promise();
  }
})();
