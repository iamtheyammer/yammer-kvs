const validSettings = require('./validSettings');

function set(config, newConfig) {
  if (!Object.keys(newConfig).
    some(key => validSettings.includes(key))) {
    return new Error('One or more of your config settings ' +
      'is invalid.');
  }
  const c = {
    ...config,
    user: {
      ...config.user,
      ...newConfig
    }
  }
  return c;
}

module.exports = set;