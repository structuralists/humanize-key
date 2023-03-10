Format string keys for display

[![CI](https://github.com/lubelski/humanize-key/actions/workflows/main.yml/badge.svg)](https://github.com/lubelski/humanize-key/actions/workflows/main.yml)

[![Publish](https://github.com/lubelski/humanize-key/actions/workflows/publish.yml/badge.svg)](https://github.com/lubelski/humanize-key/actions/workflows/publish.yml)

<span class="badge-npmversion"><a href="https://npmjs.org/package/humanize-key" title="View this project on NPM"><img src="https://img.shields.io/npm/v/humanize-key.svg" alt="NPM version" /></a></span>

# Installation

-  `npm install humanize-key`

# Usage

```ts
import humanizeKey from 'humanize-key'
// or
const { humanizeKey } = require('humanize-key')

const displayString = humanizeKey(key)
```

```ts
const display = (obj) => {
   forEach(obj, (value, key) => console.log(`${humanizeKey(key)}: ${value}`))
}
```

```js
display({
   id: 12,
   userName: 'bobby',
   'first-name': 'Bob',
   last_name: 'Roberts',
   account_id: 321,
})
```

```
ID: 12
User Name: bobby
First Name: Bob
Last Name: Roberts
Account ID: 321
```

currently there are two exemptions to the default capitalization

-  `id` -> `ID` rather than `Id`
-  `ids` -> `IDs`rather than `Ids`

other custom values can be set by use of `makeHumanizeKey`

# Custom values

domains-specific acronyms

```ts
import { makeHumanizeKey } from 'humanize-key'
const humanizeKey = makeHumanizeKey({ acronyms: ['IRS', 'SSN'] })
```

```ts
const obj = {
   id: 12,
   ssn_last_four: '1234',
   'irs-account-number': '5678',
}
```

```
ID: 12
SSN Last Four: 1234
IRS Account Number: 5678
```

custom capitalization for terms of art

```ts
import { makeHumanizeKey } from 'humanize-key'
const humanizeKey = makeHumanizeKey({
   acronyms: ['URL']
   uniques: {
      oauth: "OAuth",
      uuids: "UUIDs",
   }
})
```

```ts
display({
   oauth_url: 'http://localhost:3000/oauth/callback',
   recent_uuids: [],
})
```

```
OAuth URL: http://localhost:3000/oauth/callback
Recent UUIDs: []
```
