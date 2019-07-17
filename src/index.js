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
    TableName: 'yammer_kvs',
    ValidateKeys: false
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
    /**
     * Read a single value from a single key.
     * @param {string} key - The key you'd like the value of
     * @returns {*} The value of the specified key, or null if that key doesn't exist/have a value.
     */
    single: injectConfig(actions.read.single),
    /**
     * Read multiple values from multiple keys.
     * @param {Array<string>} keys - An array of string keys that conform to the validation standard.
     * @returns {Object} An object with your keys and values, ex: `{ MY_KEY: 'My value' }`
     */
    multiple: injectConfig(actions.read.multiple)
  },
  update: {
    /**
     * Upsert a single key/value pair. If the key already exists, the value will be updated.
     * Otherwise, the key will be created with the specified value. Keys must conform to the validation
     * standard.
     * @param {Object} kvp - An object with a single key/value pair, ex: `{ MY_KEY: 'My value' }`
     * @returns {Object} The key/value pair you just upserted.
     */
    single: injectConfig(actions.update.single),
    /**
     * Upserts multiple keys. If a specified key exists, its value will be updated.
     * Otherwise, the key will be created with the specified value. Keys must conform to the 
     * validation standard.
     * @param {Object} kvps - An object with as many key/value pairs you'd like. Ex: `{
     * MY_KEY: 'My key!',
     * IS_TRUE: true
     * }`
     * @returns {Object} An object with a single key, `UnprocessedItems`, and it'll have 
     * kvps that weren't processed by DynamoDB. Nearly always empty.
     * Ex: `{ UnprocessedItems: {} }`
     */
    multiple: injectConfig(actions.update.multiple)
  },
  config: {
    /**
     * Allows you to update the config. See readme for options.
     * @param {Object} config - An object with settings to be merged with the current config.
     * @returns {Object} Your current config.
     */
    set: updateConfig,
    /**
     * Returns your current config.
     * @returns {Object} Your current config.
     */
    get: () => config.user,
    
    /**
     * Allows you to access some underlying AWS config settings,
     * like your region.
     */
    aws: {
      setRegion: (region) => AWS.config.update({region}),
     /**
      * Access to the `AWS.config.update` function. Useful for setting region.
      * @param {Object} settings - Settings to pass to `AWS.config.update`
      */
      configUpdate: (settings) => AWS.config.update(settings)
    }
  }
}