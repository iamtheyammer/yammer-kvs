# yammer-kvs
 Yammer Key Value Store npm package. Basically only for my own use.

 Hooks to my AWS DynamoDB table (`yammer_kvs`) and provides very high-level Key-Value CRUD (currently only CR) queries.

 # Reference

 ## Read

 ### Single record
 Reads a single value from a given key.

 Usage: `yammerkvs.read.single('MY_KEY')`

 Sample response: `'This is the value of MY_KEY'`

 ### One or more records
 Reads one or more records from one or more given keys.

 Usage:
```js
yammerkvs.read.multiple([
  'MY_KEY',
  'MY_KEY2'
]);
```

Sample response:
```js
{
  MY_KEY: 'This is the value of MY_KEY',
  MY_KEY2: 'This is the value of MY_KEY2'
}
```

## Update/insert

### Single record
Upserts a single key/value pair.

Usage:
```js
yammerkvs.update.single({
  MY_KEY: 'New value for MY_KEY.'
});
```

Sample response:
```js
{
  MY_KEY: 'New value for MY_KEY.'
}
```

### One or more records
Upserts one or more key/value pairs.

Usage:
```js
yammerkvs.update.multiple({
  MY_KEY: 'Another value for MY_KEY',
  MY_KEY2: 'New value for MY_KEY2'
});
```

Sample response:
```js
{ 
  UnprocessedItems: {}
}
```

# Validation
`yammer_kvs` only accepts keys that match this regex: `/[A-Z0-9_]+/`. You'll recieve an error if a specified key doesn't match. All keys in a query must match to be sent to Amazon.

Your request will also error out if you have a key without a value.