import _ from 'lodash'
import { toString } from './index.js'

const stylish = (diff) => {
  const replacer = ' '
  const spacesCount = 2

  const iter = (value, depth) => {
    if (!_.isObject(value)) {
      return toString(value)
    }

    const indentSize = spacesCount * depth + spacesCount * (depth - 1)
    const bracketIndent = replacer.repeat(indentSize - spacesCount)

    const getIndent = (val) => {
      if (
        val
        && typeof val === 'object'
        && 'state' in val
        && ['added', 'removed', 'updated'].includes(val.state)
      ) {
        return replacer.repeat(indentSize)
      }

      return replacer.repeat(indentSize + spacesCount)
    }

    const keys = _.keys(value)

    const lines = keys.flatMap((key) => {
      const val = value[key]

      let valueToShow
      let isObject = false

      if (!val || typeof val !== 'object' || !('state' in val)) {
        valueToShow = val
      }
      else {
        isObject = true
        switch (val.state) {
          case 'added':
            valueToShow = val.newValue
            break
          case 'removed':
          case 'unchanged':
            valueToShow = val.oldValue
            break
          case 'nested':
            valueToShow = val.children
            break
          case 'updated':
            break
        }
      }

      if (isObject) {
        switch (val.state) {
          case 'removed':
            return `${getIndent(val)}- ${key}: ${iter(valueToShow, depth + 1)}`
          case 'added':
            return `${getIndent(val)}+ ${key}: ${iter(valueToShow, depth + 1)}`
          case 'updated': {
            const lineBefore = `${getIndent(val)}- ${key}: ${iter(val.oldValue, depth + 1)}`
            const lineAfter = `${getIndent(val)}+ ${key}: ${iter(val.newValue, depth + 1)}`
            return `${lineBefore}\n${lineAfter}`
          }
          case 'nested':
            return `${getIndent(val)}${key}: ${iter(valueToShow, depth + 1)}`
          case 'unchanged':
            return `${getIndent(val)}${key}: ${iter(valueToShow, depth + 1)}`
        }
      }

      return `${getIndent(val)}${key}: ${iter(valueToShow, depth + 1)}`
    })

    return ['{', ...lines.flat(), `${bracketIndent}}`].join('\n')
  }

  return iter(diff, 1)
}

export default stylish
