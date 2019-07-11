const normalize = require('../normalize');
const validate = require('../validate');
const tableName = require('../values').tableName;

function multiple(docClient, keys) {
  const requestItems = keys.map((key) => ({ key }));
  return docClient.batchGet({
    RequestItems: {
      [tableName]: {
        Keys: requestItems
      }
    }
  }).promise().then((data => {
    let res = {}
    data['Responses'][tableName].forEach((kvp) => {
      res[kvp.key] = kvp.value
    });
    return res;
  }));
}

function single(docClient, key) {
  return docClient.get({
    TableName: tableName,
    Key: {
      key
    }
  }).promise().then(kvp => kvp.Item ? kvp.Item.value : kvp);
}

module.exports = {
  multiple,
  single
};