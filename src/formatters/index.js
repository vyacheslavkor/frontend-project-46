import stylish from './stylish.js'
import plain from './plain.js'

const getFormatter = (format) => {
  if (!isAvailableFormat(format)) {
    throw new Error(`Unknown format: ${format}`)
  }

  const map = {
    stylish: diff => stylish(diff),
    plain: diff => plain(diff),
  }

  return map[format]
}

const isAvailableFormat = (format) => {
  const availableFormats = new Set(['stylish', 'plain'])
  return availableFormats.has(format)
}

export const toString = (value) => {
  if (value === null) {
    return 'null'
  }

  if (value === undefined) {
    return 'undefined'
  }

  return String(value).trim()
}

export default getFormatter
