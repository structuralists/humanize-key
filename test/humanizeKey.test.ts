import humanizeKey from '../src/humanizeKey'

type Cases = Array<[unknown, string] | [unknown, string, string]>

const testCases = (cases: Cases) => {
   cases.forEach((item) => {
      const [input, result] = item
      const fromatted_input = typeof input === 'string' ? `'${input}'` : input

      it(`${fromatted_input} -> '${result}'`, () => {
         expect(humanizeKey(input)).toBe(result)
      })
   })
}

describe('default humanizeKey', () => {
   describe('handles empty values', () => {
      testCases([
         [undefined, ''],
         ['', ''],
         [NaN, ''],
      ])
   })

   describe('handles numbers', () => {
      testCases([
         [-1, '1'], // todo: consider caching differently to support all numbers
         [12, '12'],
         [0, '0'],
         [Infinity, ''],
         [-Infinity, ''],
      ])
   })

   describe('handles snake case', () => {
      testCases([
         ['hello_my_darling', 'Hello My Darling'],
         ['hello_ my_ darling', 'Hello My Darling'],
      ])
   })

   describe('handles camel case', () => {
      testCases([
         ['helloMyDarling', 'Hello My Darling'],
         ['helloMyDarling', 'Hello My Darling'],
      ])
   })

   describe('handles camel with acronyms', () => {
      testCases([['IRSCode', 'IRS Code']])
   })

   describe('handles pascal case', () => {
      testCases([
         ['helloMyDarling', 'Hello My Darling'],
         ['Hello My Darling', 'Hello My Darling'],
      ])
   })

   describe('handles kebab case', () => {
      testCases([
         ['hello-my-darling', 'Hello My Darling'],
         ['hello- my- darling', 'Hello My Darling'],
      ])
   })

   describe('handles spaces', () => {
      testCases([
         ['hello my darling', 'Hello My Darling'],
         ['hello  my  darling', 'Hello My Darling'],
      ])
   })

   describe('handles default uniques', () => {
      testCases([
         ['id', 'ID'],
         ['ids', 'IDs'],
         ['user_id', 'User ID'],
         ['user_ids', 'User IDs'],
      ])
   })
})
