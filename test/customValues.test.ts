import humanizeKey, { makeHumanizeKey } from '../src/humanizeKey'

type HumanizeFn = typeof humanizeKey

type Cases = Array<[unknown, string] | [unknown, string, string]>

const makeTestCases = (huamizeFn: HumanizeFn) => (cases: Cases) => {
   cases.forEach((item) => {
      const [input, result] = item
      const fromatted_input = typeof input === 'string' ? `'${input}'` : input

      it(`${fromatted_input} -> '${result}'`, () => {
         expect(huamizeFn(input)).toBe(result)
      })
   })
}

describe('custom humanizeKey', () => {
   const humanizefn = makeHumanizeKey({ acronyms: ['SSN'] })
   const testCases = makeTestCases(humanizefn)

   describe('custom acronyms', () => {
      testCases([['ssn_number', 'SSN Number']])
   })

   describe('custom still handles default uniques', () => {
      testCases([
         ['id', 'ID'],
         ['ids', 'IDs'],
         ['user_id', 'User ID'],
         ['user_ids', 'User IDs'],
      ])
   })
})

describe('overriding defaults', () => {
   const humanizefn = makeHumanizeKey({ uniques: { id: 'id', ids: null } })
   const testCases = makeTestCases(humanizefn)

   describe('does not handle SSN', () => {
      testCases([['ssn_number', 'Ssn Number']])
   })

   describe('custom still handles default uniques', () => {
      testCases([
         ['id', 'id'], // lowercase value preserved by custom unique and overrides default value
         ['ids', 'Ids'],
         ['user_id', 'User id'],
         ['user_ids', 'User Ids'], // null disables the custom value and treats Ids as a regular word
      ])
   })
})
