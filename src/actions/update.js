const normalize = require('../normalize');
const validate = require('../validate');
const tableName = require('../values').tableName;
const util = require('../util');

function single(config, kvp) {
  const nKvp = normalize.kvp(kvp, config.user.Prefix);
  console.log(nKvp)
  if (!validate.kvp([nKvp])) return new Error('Key failed validation.');
  return config.client.update({
    TableName: tableName,
    Key: {
      key: nKvp.key
    },
    UpdateExpression: 'set #vl = :v',
    ExpressionAttributeNames: {
      '#vl': 'value'
    },
    ExpressionAttributeValues: {
      ':v': nKvp.value
    },
    ReturnValues: 'ALL_NEW'
  }).promise().then(res => res.Attributes);
}

function multiple(config, kvps) {
  const putRequests = [];
  Object.keys(kvps).forEach(key => {
    putRequests.push({
      PutRequest: {
        Item: {
          key: util.applyPrefix(config.user.Prefix, key),
          value: kvps[key]
        }
      }
    })
  });
  if(!validate.kvp(
    putRequests.map(pr => pr.PutRequest.Item)
  )) return new Error('One or more kvps failed validation.');
  return config.client.batchWrite({
    RequestItems: {
      [tableName]: putRequests
    }
  }).promise();
}

module.exports = {
  single,
  multiple
}