import { describe, it, expect } from 'bun:test'

import defaultExport, { humanizeKey, makeHumanizeKey } from '../src/humanizeKey'

describe('public export surface', () => {
   it('exposes a default export function', () => {
      expect(typeof defaultExport).toBe('function')
   })

   it('exposes a named humanizeKey function', () => {
      expect(typeof humanizeKey).toBe('function')
   })

   it('exposes a named makeHumanizeKey factory', () => {
      expect(typeof makeHumanizeKey).toBe('function')
   })

   it('the default export and named humanizeKey are the same function', () => {
      expect(defaultExport).toBe(humanizeKey)
   })

   it('makeHumanizeKey returns a callable formatter', () => {
      const fn = makeHumanizeKey()
      expect(typeof fn).toBe('function')
      expect(fn('hello_world')).toBe('Hello World')
   })
})
