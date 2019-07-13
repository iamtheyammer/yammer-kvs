# yammer-kvs speed testing methodology

## Question

What is the speed penalty of using `yammer-kvs` over AWS SDK's `AWS.DynamoDB.DocumentClient` when reading a single value from a single key?

## Method

Read a single value from a single key n times.

Tested using `yammer-kvs` version 1.0.8 and `aws-sdk` 2.493.0.

## Data

| Number of tries | AWS Average | `yammer-kvs` Average | Difference (AWS-`yammer-kvs`) | Percentage difference |
| :-------------- | :---------- | :------------------- | :---------------------------- | :-------------------- |
| 50 | 239.6ms | 233.54ms | 6.06ms | 2.562% |
| 50 | 241.14ms | 238.82ms | 2.32ms | 0.967% |
| 10 | 259.5ms | 239.1ms | 20.4ms | 8.183% |
| **Total (110)** | **246.747ms** | **237.154ms** | **9.593ms** | **3.965%** |

## Conclusion

In the event of reading a single value from a single key, `yammer-kvs` outperforms the AWS SDK. I'm not totally sure why this is because `yammer-kvs` uses AWS SDK's `AWS.DynamoDB.DocumentClient` under the hood.

## Code used

```js
const yammerkvs = require('./src');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-2' })
const client = new AWS.DynamoDB.DocumentClient();

yammerkvs.config.set({
  Prefix: 'TEST'
}); 

async function test() {
  const awsTimes = [];
  const yammerTimes = [];
  for (var i = 0; i < 50; i++) {
    console.log('Reading AWS...', i);
    awsTimes.push(await timeCall(
      async () => await awsRead('TEST')
    ));
    console.log('Reading Yammer...', i);
    yammerTimes.push(await timeCall(
      async () => await yammerRead('TEST_TEST')
    ));
  }
  const awsAvg = awsTimes.reduce((sum, val) => sum + val)/awsTimes.length;
  const yammerAvg = yammerTimes.reduce((sum, val) => sum + val)/yammerTimes.length;
  console.log('AWS Average: ' + awsAvg + ' ms.');
  console.log('Yammer Average: ' + yammerAvg + ' ms.');
  console.log(awsTimes, yammerTimes);
}

async function timeCall(call) {
  const start = Date.now();
  await call();
  return Date.now() - start;
}

async function awsRead(key) {
  await client.get({
    TableName: 'yammer_kvs',
    Key: {
      key: key
    }
  }).promise().then(kvp => kvp.Item ? kvp.Item.value : kvp);
}

async function yammerRead(key) {
  return await yammerkvs.read.single(key);
}

test();
```

`node test.js`