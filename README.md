small utility for formatting string keys for display

[![Release](https://github.com/lubelski/humanize-key/actions/workflows/release.yml/badge.svg)](https://github.com/lubelski/humanize-key/actions/workflows/release.yml)

<span class="badge-npmversion"><a href="https://npmjs.org/package/humanize-key" title="View this project on NPM"><img src="https://img.shields.io/npm/v/humanize-key.svg" alt="NPM version" /></a></span>

# Description

a (slightly configurable) utility for formatting string keys for display

# Installation

-  `npm install humanize-key`
-  `yarn install humanize-key`

# Usage

```ts
import humanizeKey from 'humanize-key'
const displayString = humanizeKey(key)
```

```ts
const obj = {
   id: 12,
   userName: 'bobby',
   'first-name': 'Bob',
   last_name: 'Roberts',
   account_id: 321,
}

forEach(obj, (value, key) => {
   console.log(`${humanizeKey(key)}: ${value}`)
})
```

```js
ID: 12
User Name: bobby
First Name: Bob
Last Name: Roberts
Account ID: 321
```

# Custom values

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

```js
ID: 12
SSN Last Four: 1234
IRS Account Number: 5678
```
