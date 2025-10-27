import stylish from './stylish.js'
import plain from './plain.js'
import json from './json.js'

const getFormatter = (format) => {
  if (!isAvailableFormat(format)) {
    throw new Error(`Unknown format: ${format}`)
  }

  const map = {
    stylish: diff => stylish(diff),
    plain: diff => plain(diff),
    json: diff => json(diff),
  }

  return map[format]
}

const isAvailableFormat = (format) => {
  const availableFormats = new Set(['stylish', 'plain', 'json'])
  return availableFormats.has(format)
}

export const toString = (value) => {
  if (value === null) {
    return 'null'
  }

  return String(value).trim()
}

export default getFormatter
