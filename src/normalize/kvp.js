module.exports = (kvp, prefix) => {
  const kvpObj = {
    key: (prefix ? prefix : '') + Object.keys(kvp)[0],
    value: Object.values(kvp)[0]
  };
  // kvpObj.value = kvp[kvpObj.key];
  return kvpObj;
}