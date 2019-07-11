module.exports = (kvps) => {
  return !kvps.some((kvp) => {
    if (!kvp.key || !kvp.value) return true;
    if (kvp.key.match(/[A-Z0-9_]+/)[0] !== kvp.key) return true;
    return false;
  });
}