const normalize = require('../normalize');
const validate = require('../validate');
const util = require('../util');

function multiple(config, keys) {
  const requestItems = keys.map((key) => ({ key: util.applyPrefix(config.user.Prefix, key) }));
  return config.client.batchGet({
    RequestItems: {
      [config.user.TableName]: {
        Keys: requestItems
      }
    }
  }).promise().then((data => {
    let res = {}
    data['Responses'][config.user.TableName].forEach((kvp) => {
      res[util.removePrefix(config.user.Prefix, kvp.key)] = kvp.value
    });
    return res;
  }));
}

function single(config, key) {
  return config.client.get({
    TableName: config.user.TableName,
    Key: {
      key: util.applyPrefix(config.user.Prefix, key)
    }
  }).promise().then(kvp => kvp.Item ? kvp.Item.value : kvp);
}

module.exports = {
  multiple,
  single
};