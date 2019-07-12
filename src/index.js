const AWS = require("aws-sdk");

const actions = require('./actions');
const configActions = require('./config');

AWS.config.update({
  region: "us-east-2"
});

const docClient = new AWS.DynamoDB.DocumentClient();

let config = {
  client: docClient,
  user: {
    Prefix: '',
    TableName: 'yammer_kvs'
  }
}

function updateConfig(newConfig) {
  config = configActions.set(config, newConfig);
  return config.user;
}

function injectConfig(func) {
  return (param) => func(config, param);
}

module.exports = {
  read: {
    single: injectConfig(actions.read.single),
    multiple: injectConfig(actions.read.multiple)
  },
  update: {
    single: injectConfig(actions.update.single),
    multiple: injectConfig(actions.update.multiple)
  },
  config: {
    set: updateConfig,
    get: () => config.user,
    setAWS: AWS.config.update
  }
}

// test()