const AWS = require("aws-sdk");
const actions = require('./actions');

AWS.config.update({
  region: "us-east-2"
});

const docClient = new AWS.DynamoDB.DocumentClient();

// async function test() {
//   const data = await injectClient(actions.update.multiple)({
//     MODIFY_TEST: 'I did.',
//     MODIFY_TEST2: 'I did.'
//   });
//   console.log(data);
// }

function injectClient(func) {
  return (param) => func(docClient, param);
}

module.exports = {
  read: {
    single: injectClient(actions.read.single),
    multiple: injectClient(actions.read.multiple)
  },
  update: {
    single: injectClient(actions.update.single),
    multiple: injectClient(actions.update.multiple)
  }
}

// test()