const normalize = require('../normalize');
const validate = require('../validate');
const util = require('../util');

function single(config, kvp) {
  const nKvp = normalize.kvp(kvp, config.user.Prefix);
  if(config.user.ValidateKeys === true) {
    if (!validate.kvp([nKvp])) return new Error('Key failed validation.');
  }
  return config.client.update({
    TableName: config.user.TableName,
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
  if(config.user.ValidateKeys === true) {
    if (!validate.kvp(
      putRequests.map(pr => pr.PutRequest.Item)
    )) return new Error('One or more kvps failed validation.');
  }
  return config.client.batchWrite({
    RequestItems: {
      [config.user.TableName]: putRequests
    }
  }).promise();
}

module.exports = {
  single,
  multiple
}