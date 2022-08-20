const compact = (str: string) => {
   return str
      .split(' ')
      .map((word) => word.trim())
      .filter((word) => !!word)
      .join(' ')
}

type Formatter = (str: string) => string

const mapOverWords = (str: string, fn: Formatter) => {
   return str
      .split(' ')
      .map(fn)
      .join(' ')
}

const capitalizeFirstLetter = (str: string) => {
   if (!str) return ''
   return str.slice(0, 1).toUpperCase() + str.slice(1)
}

const toUpperCase = (word: string) => word.toUpperCase()

const capitalizeWords = (str: string) => str.replace(/\b\w/g, toUpperCase)

const hypensToSpaces = (str: string) => str.replace(/-/g, ' ')

const underscoresToSpaces = (str: string) => str.replace(/_/g, ' ')

const trim = (str: string) => str.trim()

const humanizeKebabKey = (str: string) => trim(hypensToSpaces(str))

const humanizeSnakeKey = (str: string) => trim(underscoresToSpaces(str))

const deCamel = (str: string) => {
   return str
      .replace(/([A-Z]+)/g, ' $1')
      .replace(/([A-Z][a-z])/g, ' $1')
      .trim()
}

const humanizeCamelKey = (str: string) => {
   return capitalizeFirstLetter(deCamel(str))
}

type Acronyms = string[]

type Uniques = Record<string, string | null>

type DefaultUnqiues = Record<string, string>

const DEFAULT_ACRONYMS: Acronyms = ['id']

const DEFAULT_UNIQUES: DefaultUnqiues = { ids: 'IDs' }

type Args = {
   acronyms?: Acronyms
   uniques?: Uniques
}

const makeHumanizeKey = (args?: Args) => {
   const uniqueKeys: Record<string, string> = { ...DEFAULT_UNIQUES }

   const acronyms = args?.acronyms ? [...DEFAULT_ACRONYMS, ...args.acronyms] : DEFAULT_ACRONYMS

   acronyms.forEach((key) => {
      uniqueKeys[key.toLowerCase()] = key.toUpperCase()
   })

   if (args?.uniques) {
      for (const key in args.uniques) {
         const val = args.uniques[key]
         if (val === null) {
            delete uniqueKeys[key]
         } else {
            uniqueKeys[key] = val
         }
      }
   }

   const handleUnique = (str: string) => {
      const strLower = str.toLowerCase()

      if (str in uniqueKeys) return uniqueKeys[str]

      if (strLower in uniqueKeys) return uniqueKeys[strLower]

      return str
   }

   const handleUniques = (str: string) => mapOverWords(str, handleUnique)

   const cache: Record<string, string> = { '': '' }

   const humanizeKey = (input: unknown): string => {
      const key =
         typeof input === 'number' && isFinite(input)
            ? `${input}`
            : typeof input === 'string'
            ? input
            : ''

      if (key in cache) return cache[key]

      const str = key.includes('-')
         ? humanizeKebabKey(key)
         : key.includes('_')
         ? humanizeSnakeKey(key)
         : humanizeCamelKey(key)

      const result = handleUniques(capitalizeWords(compact(str)))

      cache[key] = result

      return result
   }

   return humanizeKey
}

const defaultHumanizeKey = makeHumanizeKey()

export { makeHumanizeKey }

export default defaultHumanizeKey
