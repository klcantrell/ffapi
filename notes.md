## dynamodb local shell

###getItem

```javascript
const params = {
  TableName: 'ff_characters',
  Key: {
    // a map of attribute name to AttributeValue for all primary key attributes

    name: {
      S: 'Cloud Strife',
    },
    //(string | number | boolean | null | Binary)
    // more attributes...
  },
  AttributesToGet: [
    // optional (list of specific attribute names to return)
    'name',
    'hometown',
    'weapon',
    'game',
    // ... more attribute names ...
  ],
  ConsistentRead: false, // optional (true | false)
  ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
};
dynamodb.getItem(params, function(err, data) {
  if (err) ppJson(err);
  // an error occurred
  else ppJson(data); // successful response
});
```

### scan a table (get all items in a table)

```javascript
const params = {
  TableName: 'ff_characters',
  ConsistentRead: false, // optional (true | false)
};
dynamodb.scan(params, function(err, data) {
  if (err) ppJson(err);
  // an error occurred
  else ppJson(data); // successful response
});
```

### scan a table (get only items with certain constraints)

```javascript
const params = {
  TableName: 'ff_characters',
  FilterExpression: 'game = :value', // a string representing a constraint on the attribute
  ExpressionAttributeValues: {
    // a map of substitutions for all attribute values
    ':value': {
      S: 'FF7',
    },
  },
  Select: 'ALL_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES |
  //           SPECIFIC_ATTRIBUTES | COUNT)
};
dynamodb.scan(params, function(err, data) {
  if (err) ppJson(err);
  // an error occurred
  else ppJson(data); // successful response
});
```
