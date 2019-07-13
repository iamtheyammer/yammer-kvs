# Configuring DynamoDB for yammer-kvs

Super simple!

## Web Portal Instructions

### Create table

1. Open DynamoDB in the portal (click [here](https://console.aws.amazon.com/dynamodb/home))
2. Note down your region (yammer-kvs defaults to US East 2 (Ohio), but you can change this)
3. Create a new table
4. Name your table (yammer-kvs defaults to `yammer_kvs`, but you can change this)
5. Name your Primary Key `key` with a `String` type. No sort key is needed.
6. Set your scaling settings, if needed (default settings for most hobby projects are fine)
7. Click create

### Add a test key/value pair

1. Open your new table by clicking on its name if it's not already selected
2. Click on the items tab
3. Click on Create Item
4. Enter your key (remember that keys you want to update with yammer-kvs must be uppercase letters, numbers and underscores only)
5. Click on the + to the left of key
6. Click on Append
7. Click on String
8. Enter `value` for the field name, and some test text
9. Click on save towards the bottom right

### Changing yammer-kvs config

**If you set your table name to `yammer_kvs`, and your AWS region is `us-east-2`, you're done.** Otherwise, follow these instructions to get yammer-kvs working with your config.

Right after importing yammer-kvs in your code, add this code, tailored to your needs:

```js
// need to set your region?
yammerkvs.config.aws.setRegion('my-aws-region');

// need to set your table name?
yammerkvs.config.set({
  TableName: 'my_table_name'
});
```