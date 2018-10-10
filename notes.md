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
  ExpressionAttributeNames: {
    // a map of substitutions for attribute names with special characters
    '#name': 'name',
    '#game': 'game',
    '#hometown': 'hometown',
    '#weapon': 'weapon',
  },
  ProjectionExpression: '#name, #hometown, #weapon, #game',
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
  FilterExpression: '#game = :value', // a string representing a constraint on the attribute
  ExpressionAttributeNames: {
    // a map of substitutions for attribute names with special characters
    '#name': 'name',
    '#game': 'game',
    '#hometown': 'hometown',
    '#weapon': 'weapon',
  },
  ExpressionAttributeValues: {
    // a map of substitutions for all attribute values
    ':value': {
      S: 'FF7',
    },
  },
  ProjectionExpression: '#name, #hometown, #weapon, #game',
};
dynamodb.scan(params, function(err, data) {
  if (err) ppJson(err);
  // an error occurred
  else ppJson(data); // successful response
});
```
