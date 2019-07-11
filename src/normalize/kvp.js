module.exports = (kvp) => {
  const kvpObj = {
    key: Object.keys(kvp)[0]
  };
  kvpObj.value = kvp[kvpObj.key];
  return kvpObj;
}