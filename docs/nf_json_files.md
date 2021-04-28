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
      "scripted": "Boolean",
      "keyContent": "String",
      "valueContent": "String"
    }
  ]
}
```

---

## `nf`: Object

This object is the root object and stores the whole configuration.

### `nf.ascii`: String
The `ascii` property defines the ASCII art which'll be displayed on the left.

---

## `nf.title`: Object
This object describes the title configuration. The title is above the data, and it looks like this:

```
name@location [the title text]
------------- [the seperator]
[data starts here]
```

### `nf.title.activated`: Boolean

Determines whether the title line should be displayed.

> Note: This affects the separator. If this is `false`, `nf.title.separator` will also be `false`.

### `nf.title.name`: String

Determines the name (the part before the `@`) in the title. This is intended to be your username, but you can choose another text.

### `nf.title.location`: String

Determines the location (the part after the `@`) in the title. This is intended to be GitHub or the platform where you use the output, but you can choose another text. 

### `nf.title.separator`: Boolean

Determines whether the separator (the `---------` under the title text) should be displayed.

---

## `nf.data[]`: Object

The data array stores the main data displayed on the right of the ASCII art. A data entry can look like this: `Key: Value`.

### `nf.data[].type`: String
This property describes the type of the data object. There are a few types:

Type | What it does
-----|-------------
`Value` | A simple Key/Value pair with one word for each (more than one word will break the syntax highlighting, using one word and then more in parentheses works for some reason tho)
`String` | A Key/String pair, but the string can contain spaces, but it can't be soft wrapped.
`LongText` | A Key/Text pair, delimited by `::`, allows spaces and soft wraps without breaking the syntax highlighting. Can also be used for lists.

### `nf.data.scripted`: Boolean

### `nf.data[].keyContent`: String

### `nf.data[].valueContent`: String