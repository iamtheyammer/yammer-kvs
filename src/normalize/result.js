module.exports = (kvp, prefix) => (
  {
    [prefix ? kvp.key.replace(prefix, '') : kvp.key]: kvp.value
  }
);