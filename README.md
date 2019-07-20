# yammer-kvs
Yammer Key/Value Store.

[![NPM](https://nodei.co/npm/yammer-kvs.png?compact=true)](https://npmjs.org/package/yammer-kvs)

This package wraps around AWS's DynamoDB and turns it into a Key/Value Store (KVS). Keys are optionally of a fixed schema (see [Validation](#Validation)). [It's even about 4% faster than using `aws-sdk`!](/docs/speedTesting.md) (tested reading a single key's value multiple times)

It expects that you have a primary key named `key`. See [this](/docs/dynamoConfig.md) document for DynamoDB configuration instructions.

# Reference

## Read

### Single record
Reads a single value from a given key.

Usage: 
```js
await yammerkvs.read.single('MY_KEY')
```

Sample response: 
```js
'This is the value of MY_KEY'
```

### One or more records
Reads one or more records from one or more given keys.

Usage:
```js
await yammerkvs.read.multiple([
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
await yammerkvs.update.single({
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
await yammerkvs.update.multiple({
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

## Config

### Set
Set as many or as few config vars as you'd like.

```js
yammerkvs.config.set({
  /*
    Used as a prefix when reading and writing keys.
    Once you define this prefix in config, you won't see it again--
    All of your requests will prepended with your prefix, and all
    responses will have the prefix removed.
    Optional; defaults to no prefix.
  */
  Prefix: 'YMR_',
  /*
    Allows you to set the name of your DynamoDB Table.
    Optional; this defaults to 'yammer_kvs'
  */
  TableName: 'yammer_kvs',
  /*
    Allows you to choose whether you'd like to validate your keys
    to the schema at the bottom of the README. Uppercase letters,
    underscores and numbers are only allowed when this is enabled.
  */   
  ValidateKeys: false
});
```

This will return the new config object, so the same response you'd get from `yammerkvs.config.get()`.

### Set AWS

Allows you to access the `DynamoDB` constructor to add things like region, access key id, etc. See [this](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#constructor-property) document from AWS about the options you can put in here.

```js
yammerkvs.config.aws.configUpdate({
  region: 'us-east-2',
  endpoint: 'https://dynamodb.us-east-2.amazonaws.com'
})
```

### Set region

Allows you to set only the AWS region.

```js
yammerkvs.config.aws.setRegion('us-east-2')
```


# Validation

**This section only applies if `ValidateKeys` is set to true in your config. It's false by default.**

`yammer_kvs` only accepts keys that match this regex: `/[A-Z0-9_]+/`. You'll recieve an error if a specified key doesn't match. All keys in a query must match to be sent to Amazon.

Examples:
- ✅ `MY_KEY` - uppercase letters and underscores only
- ✅ `MY_2ND_KEY` - ^
- ❌ `my_key` - lowercase letters are not allowed
- ❌ `MY-KEY` - dashes are not allowed
- ❌ `THIS_KEY_IS_$12.49` - `$` and `.` not allowed

Your request will also error out if you have a key without a value.