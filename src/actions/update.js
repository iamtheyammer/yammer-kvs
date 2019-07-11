const normalize = require('../normalize');
const validate = require('../validate');
const tableName = require('../values').tableName;

function single(docClient, kvp) {
  const nKvp = normalize.kvp(kvp);
  if (!validate.kvp([nKvp])) return new Error('Key failed validation.');
  return docClient.update({
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

function multiple(docClient, kvps) {
  const putRequests = [];
  Object.keys(kvps).forEach(key => {
    putRequests.push({
      PutRequest: {
        Item: {
          key,
          value: kvps[key]
        }
      }
    })
  });
  console.log(JSON.stringify(putRequests, null, 2))
  if(!validate.kvp(
    putRequests.map(pr => pr.PutRequest.Item)
  )) return new Error('One or more kvps failed validation.');
  return docClient.batchWrite({
    RequestItems: {
      [tableName]: putRequests
    }
  }).promise();
}

module.exports = {
  single,
  multiple
}