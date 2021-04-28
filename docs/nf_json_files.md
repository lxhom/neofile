# `.nf.json` file documentation

A `.nf.json` file is a regular JSON file with the following structure:

```json
{
  "ascii": "String",
  "title": {
    "activated": "Boolean",
    "name": "String",
    "location": "String",
    "separator": "Boolean"
  },
  "data": [
    {
      "type": "String",
      "keyContent": "String",
      "valueContent": "String",
      "scripted": "Boolean"
    }
  ]
}
```

## Root object

### `ascii: String`
The `ascii` property defines the ASCII art which'll be displayed on the left.

### `data.[]: dataObj`
This array contains `dataObj` objects containing the data which'll be displayed on the right. The objects in the array are documented below.

## The `title` object
The title is this line at the top of the data, and it looks like this:
```
name@location
-------------
[data starts here]
```


## `dataObj` objects

### `dataObj.type`
This property describes the type of the data object. There are a few types:

Type | What it does
-----|-------------
`Value` | A simple Key/Value pair with one word for each (more than one word will break the syntax highlighting, using one word and then more in parentheses works for some reason tho)
`String` | A Key/String pair, but the string can contain spaces, but it can't be soft wrapped.
`LongText` | A Key/Text pair, delimited by `::`, allows spaces and soft wraps without breaking the syntax highlighting. Can also be used for lists.