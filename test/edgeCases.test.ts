import { describe, it, expect } from 'bun:test'

import humanizeKey, { makeHumanizeKey } from '../src/humanizeKey'

type Cases = Array<[unknown, string]>

const testCases = (fn: (input: unknown) => string) => (cases: Cases) => {
   cases.forEach(([input, result]) => {
      const formattedInput = typeof input === 'string' ? `'${input}'` : String(input)
      it(`${formattedInput} -> '${result}'`, () => {
         expect(fn(input)).toBe(result)
      })
   })
}

describe('default humanizeKey — edge cases', () => {
   const cases = testCases(humanizeKey)

   describe('non-string, non-number inputs coerce to empty string', () => {
      cases([
         [null, ''],
         [true, ''],
         [false, ''],
         [{}, ''],
         [[], ''],
         [() => 'x', ''],
         [Symbol('s') as unknown, ''],
      ])
   })

   describe('whitespace-only strings collapse to empty', () => {
      cases([
         [' ', ''],
         ['   ', ''],
         ['\t', ''],
         ['\n', ''],
         ['\t \n', ''],
      ])
   })

   describe('surrounding and interior spaces are trimmed and compacted', () => {
      cases([
         ['  hello  world  ', 'Hello World'],
         ['hello   my   darling', 'Hello My Darling'],
         // Only spaces are compacted; other whitespace (tabs) is left intact
         // and merely trimmed at the ends.
         ['\thello\tworld', 'Hello\tWorld'],
      ])
   })

   describe('finite numbers stringify', () => {
      cases([
         [3.14, '3.14'],
         [1000, '1000'],
         [-5, '5'], // leading '-' is read as a kebab delimiter, dropping the sign
         [0, '0'],
      ])
   })

   describe('non-finite numbers coerce to empty string', () => {
      cases([
         [Infinity, ''],
         [-Infinity, ''],
         [NaN, ''],
      ])
   })

   describe('single words', () => {
      cases([
         ['hello', 'Hello'],
         ['HELLO', 'HELLO'],
         ['h', 'H'],
      ])
   })

   describe('kebab takes precedence over snake when both delimiters appear', () => {
      cases([
         // '-' wins: only hyphens become spaces, so the underscore run stays a
         // single word (`_` is a word character, so no capitalization boundary).
         ['first-name_id', 'First Name_id'],
         ['a-b_c', 'A B_c'],
      ])
   })

   describe('acronym exemptions inside longer keys', () => {
      cases([
         ['id', 'ID'],
         ['ids', 'IDs'],
         ['account_id', 'Account ID'],
         ['order-ids', 'Order IDs'],
         ['userId', 'User ID'],
         ['userIds', 'User IDs'],
      ])
   })

   describe('camel/pascal with runs of capitals (acronyms)', () => {
      cases([
         ['IRSCode', 'IRS Code'],
         ['parseHTMLString', 'Parse HTML String'],
         ['SSNValue', 'SSN Value'],
      ])
   })

   describe('numbers embedded in keys are preserved', () => {
      cases([
         ['address_line_2', 'Address Line 2'],
         ['field3Name', 'Field3 Name'],
      ])
   })

   describe('non-ASCII letters are preserved but create spurious word breaks', () => {
      // Known limitation: `\b\w` treats non-ASCII letters as non-word
      // characters, so the letter after one starts a new "word" and gets
      // capitalized. Characterized here to lock the current behavior.
      cases([
         ['münchen', 'MüNchen'],
         ['café_münchen', 'Café MüNchen'],
      ])
   })

   describe('caching returns a stable result on repeat calls', () => {
      it('returns the same value when called twice', () => {
         expect(humanizeKey('cached_key')).toBe('Cached Key')
         expect(humanizeKey('cached_key')).toBe('Cached Key')
      })
      it('memoizes the empty-string result', () => {
         expect(humanizeKey('')).toBe('')
         expect(humanizeKey('')).toBe('')
      })
   })
})

describe('makeHumanizeKey — custom value paths', () => {
   it('makeHumanizeKey() with no args behaves like the default export', () => {
      const fn = makeHumanizeKey()
      expect(fn('user_id')).toBe('User ID')
      expect(fn('helloWorld')).toBe('Hello World')
   })

   describe('multiple custom acronyms are all recognized', () => {
      const fn = makeHumanizeKey({ acronyms: ['SSN', 'IRS', 'URL'] })
      testCases(fn)([
         ['ssn_last_four', 'SSN Last Four'],
         ['irs-account-number', 'IRS Account Number'],
         ['callback_url', 'Callback URL'],
         ['user_id', 'User ID'], // default acronym still applies
      ])
   })

   describe('acronyms match case-insensitively', () => {
      const fn = makeHumanizeKey({ acronyms: ['SSN'] })
      testCases(fn)([
         ['ssn', 'SSN'],
         ['SSN', 'SSN'],
         ['Ssn', 'SSN'],
      ])
   })

   describe('uniques override casing for terms of art', () => {
      const fn = makeHumanizeKey({ acronyms: ['URL'], uniques: { oauth: 'OAuth', uuids: 'UUIDs' } })
      testCases(fn)([
         ['oauth_url', 'OAuth URL'],
         ['recent_uuids', 'Recent UUIDs'],
         ['oauth', 'OAuth'],
      ])
   })

   describe('a unique keyed by its capitalized form hits the exact-match branch', () => {
      // handleUnique checks an exact match before the lowercased match, so a
      // unique keyed as the already-capitalized word wins directly.
      const fn = makeHumanizeKey({ uniques: { Foo: 'BAR' } })
      testCases(fn)([['foo', 'BAR']])
   })

   describe('a null unique disables a default exemption', () => {
      const fn = makeHumanizeKey({ uniques: { id: null } })
      testCases(fn)([
         ['id', 'Id'], // default ID exemption removed
         ['ids', 'IDs'], // the ids exemption is untouched
      ])
   })

   describe('a custom unique can lower-case a default exemption', () => {
      const fn = makeHumanizeKey({ uniques: { id: 'id' } })
      testCases(fn)([
         ['id', 'id'],
         ['user_id', 'User id'],
      ])
   })

   it('each instance keeps its own cache and acronym set', () => {
      const withSsn = makeHumanizeKey({ acronyms: ['SSN'] })
      const plain = makeHumanizeKey()
      expect(withSsn('ssn_number')).toBe('SSN Number')
      expect(plain('ssn_number')).toBe('Ssn Number')
   })
})
